const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.loginPage = (req, res) => {
  res.render("auth/login", { title: "Login" });
};

exports.registerPage = (req, res) => {
  res.render("auth/register", { title: "Cadastro de Cliente" });
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      req.flash("error", "Preencha nome, e-mail e senha.");
      return res.redirect("/cadastro");
    }

    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length > 0) {
      req.flash("error", "Este e-mail já está cadastrado.");
      return res.redirect("/cadastro");
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'cliente')",
      [name, email, phone || null, hash]
    );

    req.flash("success", "Cadastro realizado com sucesso. Agora faça login.");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Erro ao realizar cadastro.");
    res.redirect("/cadastro");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      req.flash("error", "E-mail ou senha inválidos.");
      return res.redirect("/login");
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      req.flash("error", "E-mail ou senha inválidos.");
      return res.redirect("/login");
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    if (user.role === "admin") return res.redirect("/admin");
    return res.redirect("/cliente");
  } catch (err) {
    console.error(err);
    req.flash("error", "Erro ao entrar no sistema.");
    res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
