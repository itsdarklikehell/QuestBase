# QuestBase

QuestBase is a full-stack campaign management platform built for Dungeon Masters running virtual tabletop RPG campaigns. It provides a centralized place to organize quests, track party progress, manage session notes, and keep important campaign details in one place.

As the project evolves, QuestBase aims to become a hub for creating and sharing homebrew content, building reusable campaign templates, and managing multiple campaigns from a single platform.

> Status: Early development

## Features

### Current

- **Campaign Management** — Create and manage campaigns to keep your adventures organized in one place.
- **Quest Tracking** — Create quests, track their status and difficulty, assign rewards, and organize them within a campaign.
- **NPC Management** — Build and manage NPCs with details such as roles, descriptions, levels, notes, and other character information.
- **Quest & NPC Relationships** — Associate NPCs with quests and view those relationships from either side, making it easier to keep track of who is involved in each storyline.
- **Player Invitations** — Invite players to campaigns through secure invitation links, allowing them to join and view shared campaign content.
- **Role-Based Campaign Access** — Campaign owners retain management controls while invited players receive access to view campaign content.
- **Global & Private Notes** — DMs can create general notes for all players to view. All users can create personal notes on quests and npcs they have access to.
- **Dark/Light Mode** — Toggle between dark and light themes with system preference detection.
- **PWA Support** — Install as a Progressive Web App for offline access and native-like experience.
- **Export/Import** — Export all campaign data to JSON and import it back for backup or migration.

### Planned

- Add locations + relationship between quests and NPCs
- Session recap tools
- Party inventory and rewards
- Party/Characters + assign players permission to edit their character
- Character sheets + dice rolling tool
- Items / Inventory

## Screenshots

![QuestBase Dashboard](https://github.com/yourusername/QuestBase/raw/main/screenshots/dashboard.png)

## Quick Start

### Prerequisites

- Node.js 18+
- Java 17+ (for backend)
- Maven 3.8+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/QuestBase.git
   cd QuestBase
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   mvn clean install
   ```

4. Start the development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   mvn spring-boot:run

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. Open http://localhost:5173 in your browser

### Docker

```bash
docker-compose up --build
```

## Usage

### Creating a Campaign

1. Register an account or log in
2. Click "New Campaign" on the dashboard
3. Enter a name and description
4. Start adding quests, NPCs, and locations

### Managing Quests

- Create quests with titles, descriptions, and difficulty ratings
- Assign NPCs to quests
- Track quest status (Not Started, In Progress, Completed)
- Add rewards and notes

### Managing NPCs

- Create NPCs with names, roles, and descriptions
- Set levels and add notes
- Associate NPCs with quests
- Upload custom portraits

### Exporting Data

1. Go to Settings
2. Click "Export All Data"
3. A JSON file will be downloaded with all your campaigns

### Importing Data

1. Go to Settings
2. Click "Import"
3. Select a previously exported JSON file
4. Your data will be restored

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router, TipTap
- **Backend**: Java, Spring Boot
- **Database**: H2 (dev), PostgreSQL (prod)
- **Auth**: JWT
- **Styling**: CSS Modules

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Support

Have a question, found a bug, or have an idea for QuestBase? We'd love to hear from you. Feel free to reach out anytime at support@questbase.net
