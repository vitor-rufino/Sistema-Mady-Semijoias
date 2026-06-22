const db = require("../config/db");

exports.dashboard = async (req, res) => {
  const [products] = await db.query("SELECT * FROM products ORDER BY id DESC");
  const [[stats]] = await db.query(`
    SELECT 
      COUNT(*) AS total_products,
      COALESCE(SUM(quantity), 0) AS total_stock,
      COALESCE(SUM(quantity * price), 0) AS stock_value
    FROM products
  `);

  res.render("admin/dashboard", {
    title: "Painel Administrativo",
    products,
    stats
  });
};

exports.newProductPage = (req, res) => {
  res.render("admin/product-form", {
    title: "Novo Produto",
    product: null
  });
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || quantity === "") {
      req.flash("error", "Preencha nome, preço e quantidade.");
      return res.redirect("/admin/produtos/novo");
    }

    await db.query(
      "INSERT INTO products (name, description, price, quantity, image) VALUES (?, ?, ?, ?, ?)",
      [name, description || null, price, quantity, image]
    );

    req.flash("success", "Produto cadastrado com sucesso.");
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.flash("error", "Erro ao cadastrar produto.");
    res.redirect("/admin/produtos/novo");
  }
};

exports.editProductPage = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);

  if (rows.length === 0) {
    req.flash("error", "Produto não encontrado.");
    return res.redirect("/admin");
  }

  res.render("admin/product-form", {
    title: "Editar Produto",
    product: rows[0]
  });
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (rows.length === 0) {
      req.flash("error", "Produto não encontrado.");
      return res.redirect("/admin");
    }

    const currentImage = rows[0].image;
    const image = req.file ? req.file.filename : currentImage;

    await db.query(
      "UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, image = ? WHERE id = ?",
      [name, description || null, price, quantity, image, req.params.id]
    );

    req.flash("success", "Produto atualizado com sucesso.");
    res.redirect("/admin");
  } catch (err) {
    console.error(err);
    req.flash("error", "Erro ao atualizar produto.");
    res.redirect(`/admin/produtos/${req.params.id}/editar`);
  }
};

exports.deleteProduct = async (req, res) => {
  await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);
  req.flash("success", "Produto excluído com sucesso.");
  res.redirect("/admin");
};

exports.clients = async (req, res) => {
  const [clients] = await db.query("SELECT id, name, email, phone, created_at FROM users WHERE role = 'cliente' ORDER BY id DESC");
  res.render("admin/clients", { title: "Clientes", clients });
};

exports.movements = async (req, res) => {
  const [movements] = await db.query(`
    SELECT m.*, u.name AS user_name, p.name AS product_name
    FROM user_products m
    INNER JOIN users u ON u.id = m.user_id
    INNER JOIN products p ON p.id = m.product_id
    ORDER BY m.id DESC
  `);

  res.render("admin/movements", { title: "Movimentações", movements });
};
