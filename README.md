# API Testing Lab

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/api-testing-lab.git
   cd api-testing-lab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment setup:
   - Create a `.env` file in the project root with the following variables:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/apitest?schema=public"
     SUPABASE_URL="your-supabase-url"
     SUPABASE_KEY="your-supabase-key"
     PORT=3000
     ```
   - For testing, create a `.env.test` file with similar variables pointing to a test database

4. Database setup:
   ```bash
   npx prisma migrate dev
   ```

## Running the Application

Start the development server:
```bash
npm run dev
```

The API will be accessible at `http://localhost:3000`.

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments` - Get all comments
- `GET /api/comments/:id` - Get comment by ID
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## Running Tests

Run the test suite:
```bash
npm test
```

