const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router.get("/", async (req, res, next) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const book = await prisma.book.findUnique({ where: { id: +id } });
    if (book) {
      res.json(book);
    } else {
      next({ status: 404, message: `Book with id ${id} does not exist.` });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return next({
      status: 400,
      message: "A new title must be provided.",
    });
  }

  try {
    const book = await prisma.book.findUnique({ where: { id: +id } });
    if (!book) {
      return next({
        status: 404,
        message: `Book with id ${id} does not exist.`,
      });
    }

    // Update book
    const updatedBook = await prisma.book.update({
      where: { id: +id },
      data: { title },
    });
    res.json(updatedBook);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return next({
      status: 400,
      message: "Title must be provided for a new book.",
    });
  }
  try {
    const book = await prisma.book.create({ data: { title } });
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const book = await prisma.book.findUnique({ where: { id: +id } });
    if (!book) {
      return next({
        status: 404,
        message: `Book with id ${id} does not exist.`,
      });
    }

    await prisma.book.delete({ where: { id: +id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
