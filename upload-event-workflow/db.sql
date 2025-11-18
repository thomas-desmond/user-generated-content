DROP TABLE IF EXISTS WorkflowTracking;

CREATE TABLE WorkflowTracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    instanceId TEXT NOT NULL,
    aiAnalysis TEXT
);
