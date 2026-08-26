CREATE TABLE npc_notes (
    id BIGSERIAL PRIMARY KEY,
    npc_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE npc_notes
ADD CONSTRAINT fk_npc_notes_npc
FOREIGN KEY (npc_id) REFERENCES npcs(id) ON DELETE CASCADE;

ALTER TABLE npc_notes
ADD CONSTRAINT fk_npc_notes_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE npc_notes
ADD CONSTRAINT uq_npc_notes_user_npc
UNIQUE (npc_id, user_id);


CREATE TABLE quest_notes (
    id BIGSERIAL PRIMARY KEY,
    quest_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE quest_notes
ADD CONSTRAINT fk_quest_notes_quest
FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE;

ALTER TABLE quest_notes
ADD CONSTRAINT fk_quest_notes_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE quest_notes
ADD CONSTRAINT uq_quest_notes_user_quest
UNIQUE (quest_id, user_id);