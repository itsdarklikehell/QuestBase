CREATE TABLE location_notes (
    id BIGSERIAL PRIMARY KEY,
    location_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE location_notes
ADD CONSTRAINT fk_location_notes_location
FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE;

ALTER TABLE location_notes
ADD CONSTRAINT fk_location_notes_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE location_notes
ADD CONSTRAINT uq_location_notes_user_location
UNIQUE (location_id, user_id);