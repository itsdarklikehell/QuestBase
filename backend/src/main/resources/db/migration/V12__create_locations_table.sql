CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    status VARCHAR(50),
    notes TEXT,
    campaign_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE locations
ADD CONSTRAINT fk_locations_parent
FOREIGN KEY (parent_id)
REFERENCES locations(id)
ON DELETE SET NULL;

ALTER TABLE locations
ADD CONSTRAINT fk_locations_campaign
FOREIGN KEY (campaign_id)
REFERENCES campaigns(id);