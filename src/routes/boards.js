import express from "express";
import jira from "../jiraClient";

const router = express.Router();

router.get("/", (req, res) => {
  jira.board.getProjectsFull({}, (err, resp) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(resp);
    }
  });
});

router.post("/", (req, res) => {
  const { projectKeyOrId } = req.body;

  jira.board.getAllBoards(
    {
      projectKeyOrId,
    },
    (err, resp) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(resp);
      }
    }
  );
});

router.post("/detail", (req, res) => {
  const { boardId } = req.body;

  jira.board.getBoard(
    {
      boardId,
    },
    (err, resp) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(resp);
      }
    }
  );
});

router.post("/sprints", (req, res) => {
  const { boardId } = req.body;

  jira.board.getAllSprints(
    {
      boardId,
    },
    (err, resp) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(resp);
      }
    }
  );
});

router.post("/issues", (req, res) => {
  const { boardId, sprintId } = req.body;

  jira.board.getIssuesForSprint(
    {
      boardId,
      sprintId,
      maxResults: 100,
    },
    (err, resp) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(resp);
      }
    }
  );
});

export default router;
