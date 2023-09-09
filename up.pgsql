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


CREATE TABLE status_updates (
    id serial PRIMARY KEY,
    from_status task_status NOT NULL,
    to_status task_status NOT NULL
);

CREATE TABLE reassignments (
    id serial PRIMARY KEY,
    assigned_to INTEGER NOT NULL,
    assigned_by INTEGER NOT NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
);


CREATE TABLE changes (
    id serial PRIMARY KEY,
    task_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status_update_id INTEGER,
    reassignment_id INTEGER,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (status_update_id) REFERENCES status_updates(id),
    FOREIGN KEY (reassignment_id) REFERENCES reassignments(id),
    CHECK (status_update_id IS NOT NULL OR reassignment_id IS NOT NULL)  
);


