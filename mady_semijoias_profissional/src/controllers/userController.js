const db = require("../config/db");

exports.dashboard = async (req, res) => {
  const [products] = await db.query("SELECT * FROM products ORDER BY id DESC");
  res.render("client/dashboard", {
    title: "Produtos",
    products
  });
};

exports.addProductToAccount = async (req, res) => {
  const productId = req.params.id;
  const { status } = req.body;
  const userId = req.session.user.id;

  if (!["comprado", "revenda"].includes(status)) {
    req.flash("error", "Status inválido.");
    return res.redirect("/cliente");
  }

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [rows] = await conn.query("SELECT * FROM products WHERE id = ? FOR UPDATE", [productId]);

    if (rows.length === 0) {
      await conn.rollback();
      req.flash("error", "Produto não encontrado.");
      return res.redirect("/cliente");
    }

    const product = rows[0];

    if (product.quantity <= 0) {
      await conn.rollback();
      req.flash("error", "Produto sem estoque.");
      return res.redirect("/cliente");
    }

    await conn.query("UPDATE products SET quantity = quantity - 1 WHERE id = ?", [productId]);

    await conn.query(
      "INSERT INTO user_products (user_id, product_id, status) VALUES (?, ?, ?)",
      [userId, productId, status]
    );

    await conn.commit();

    req.flash("success", "Produto adicionado à sua conta.");
    res.redirect("/cliente/minha-conta");
  } catch (err) {
    await conn.rollback();
    console.error(err);
    req.flash("error", "Erro ao adicionar produto.");
    res.redirect("/cliente");
  } finally {
    conn.release();
  }
};

exports.myAccount = async (req, res) => {
  const [items] = await db.query(`
    SELECT up.*, p.name, p.price, p.image
    FROM user_products up
    INNER JOIN products p ON p.id = up.product_id
    WHERE up.user_id = ?
    ORDER BY up.id DESC
  `, [req.session.user.id]);

  res.render("client/my-account", {
    title: "Minha Conta",
    items
  });
};
exports.cart = async (req, res) => {
  const [items] = await db.query(`
    SELECT up.*, p.name, p.price, p.image
    FROM user_products up
    INNER JOIN products p ON p.id = up.product_id
    WHERE up.user_id = ?
    ORDER BY up.id DESC
  `, [req.session.user.id]);

  res.render("client/cart", {
    title: "Carrinho",
    items
  });
};
exports.removeFromCart = async (req, res) => {
  await db.query(
    "DELETE FROM user_products WHERE id = ? AND user_id = ?",
    [req.params.id, req.session.user.id]
  );

  res.redirect("/cliente/carrinho");
};