CREATE TABLE users (
    id serial PRIMARY KEY,
    username VARCHAR(255) NOT NULL
);

CREATE TYPE task_status AS ENUM ('ToDo', 'InProgress', 'Blocked', 'InQA', 'Done', 'Deployed');

CREATE TABLE tasks (
    id serial PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status task_status NOT NULL DEFAULT 'ToDo',
    created_by INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_by INTEGER,
    updated_at TIMESTAMP,
    assigned_to INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);


CREATE TABLE status_update (
    id serial PRIMARY KEY,
    from_status task_status NOT NULL,
    to_status task_status NOT NULL
);

CREATE TABLE reassignments (
    id serial PRIMARY KEY,
    task_id INTEGER NOT NULL,
    assigned_to INTEGER NOT NULL,
    assigned_by INTEGER NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);


CREATE TABLE change (
    id serial PRIMARY KEY,
    task INTEGER NOT NULL,
    changed_by INTEGER NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status_update INTEGER,
    reassignment INTEGER,
    change_type VARCHAR(255) NOT NULL CHECK (change_type IN ('status', 'assignee')),
    FOREIGN KEY (task) REFERENCES tasks(id),
    FOREIGN KEY (changed_by) REFERENCES users(id),
    FOREIGN KEY (status_update) REFERENCES status_update(id),
    FOREIGN KEY (reassignment) REFERENCES reassignments(id),
    CHECK (status_update IS NOT NULL OR reassignment IS NOT NULL)  
);
