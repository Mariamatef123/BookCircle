# BookCircle

A community-driven book sharing platform that enables users to lend, borrow, and discuss books. BookCircle connects book owners with readers through a moderated system, ensuring secure borrowing, real-time notifications, and an engaging reading community.

---

# 📚 Features

## Authentication & Authorization

* Secure user registration and login using JWT Authentication.
* Role-based authorization with three user roles:

  * **Admin**
  * **Book Owner**
  * **Reader**
* Readers can browse books without logging in.
* Login is required to:

  * Send borrow requests
  * Like/Dislike books
  * Comment on books
  * Create reading lists

---

## Admin Features

* Review newly registered **Book Owner** accounts.
* Approve or reject Book Owner registrations.
* Review submitted book posts.
* Approve or reject books before they become visible.


---

## Book Owner Features

### Book Management (CRUD)

Book owners can:

* Add new books
* Update book information
* View their books
* Delete books

A book **cannot be deleted while it is currently borrowed.**

Each book contains:

* Cover Image
* Title
* Genre
* ISBN
* Language
* Publication Date
* Borrow Price
* Borrow Status
* Availability Period
* Owner Information

---

### Borrow Request Management

Book owners receive incoming borrow requests.

They can:

* Accept requests
* Reject requests

When a request is accepted:

* Book status changes to **Borrowed**
* Borrow period starts immediately
* Other readers cannot borrow the same book until it becomes available again.

---

## Reader Features

Readers can:

* Browse all approved books
* View detailed book information
* Search books
* Sort books
* Filter books
* Send borrow requests
* Like or dislike books
* Write comments
* Reply to comments (one reply level)
* Create personal reading lists

---

# 🔍 Search

Readers can search books by:

* Title

---

# 🎯 Filtering

Readers can filter books using:

* Genre
* Language
* Maximum Borrow Price
* Book Availability

  * Show All Books
  * Show Available Books Only

Multiple filters can be combined.

---

# ↕️ Sorting

Books can be sorted by:

* Latest Added
* Oldest Added
* Title (A → Z)
* Title (Z → A)
* Borrow Price (Low → High)
* Borrow Price (High → Low)

---

# ❤️ Reactions

Readers can:

* Like books
* Dislike books

Each reader can react once per book.

---

# 💬 Comments

Readers can:

* Write comments
* Reply to comments

The system supports:

* Single-level of replies

Example:

```
Comment
 ├── Reply
 ├── Reply
```

---

# 📖 Reading Lists

Readers can create multiple reading lists to organize books.

Examples:

* Want to Read
* Favorites
* Science Books
* Programming

---

# 📨 Borrowing Workflow

1. Reader browses available books.
2. Reader selects borrowing duration.
3. Reader sends borrow request.
4. Book owner receives notification.
5. Book owner accepts or rejects request.
6. If accepted:

   * Book becomes **Borrowed**
   * Borrow timer starts
7. When the borrowing period ends:

   * Background service automatically marks the book as **Available**
   * Readers can borrow it again.

---

# 🔔 Real-Time Notifications

BookCircle uses **SignalR** for real-time communication.

Notifications include:

### Borrow Requests

* New borrow request received
* Borrow request accepted
* Borrow request rejected

### Comments

* New comment on your book
* New reply to your comment
  
### Reactions

* Like your book
* Dislike your book

### Book Approval

* Book approved
* Book rejected

### Account Approval

* Account approved

Notifications are delivered instantly without refreshing the page.

---

# ⏰ Background Jobs (Hangfire)

BookCircle uses Hangfire to automate book availability management after a borrowing period ends.

## Workflow
* A reader selects the borrowing duration (number of days).
* The book owner accepts the borrow request.
* The book status changes to Borrowed.
* Hangfire schedules a background job based on the selected borrowing period.
* When the scheduled time is reached:
* The book status is automatically updated to Available.
* The active borrow request is completed.
* The book becomes available for other readers to borrow again.

This automation eliminates manual intervention and ensures books are returned to the available state at the correct time.

---

# 👥 User Roles

## Admin

* Approve Book Owner accounts
* Reject Book Owner accounts
* Approve books
* Reject books
* Manage system content

---

## Book Owner

* Manage books (CRUD)
* View borrow requests
* Accept requests
* Reject requests
* Receive real-time notifications

---

## Reader

* Browse books
* Search books
* Filter books
* Sort books
* Borrow books
* Like/Dislike books
* Comment
* Reply to comments
* Create reading lists

---

# 🛠 Tech Stack

### Frontend

- React
- React Router
- Axios
- SignalR Client
- React Context API


### Backend

#### Framework
- ASP.NET Core Web API (.NET 8)

#### Database
- SQL Server
- Entity Framework Core

#### Authentication & Authorization
- ASP.NET Core Identity
- JWT Authentication

#### Real-Time Communication
- SignalR

#### Background Jobs
- Hangfire

#### Security
- CORS

#### Architecture
- Dependency Injection



### Deployment

* Frontend: Vercel
* Backend: monsterasp.net
* Database: monsterasp.net

---

# 📂 Project Structure

```text
BookCircle
│
├── Controllers
│   ├── AuthController.cs
│   ├── BookController.cs
│   ├── BorrowRequestController.cs
│   ├── CommentController.cs
│   ├── NotificationController.cs
│   ├── ReactionController.cs
│   ├── ReadingListController.cs
│   └── UserController.cs
│
├── Data
│   ├── Models
│   │   ├── AvailabilityDate.cs
│   │   ├── Book.cs
│   │   ├── BorrowRequest.cs
│   │   ├── Comment.cs
│   │   ├── Notification.cs
│   │   ├── Reaction.cs
│   │   ├── ReadingList.cs
│   │   ├── ReadingListBook.cs
│   │   └── User.cs
│   ├── Repositories
│   └── DataContext.cs
│
├── DTOs
├── Enums
├── Helpers
├── Hubs
│   └── NotificationHub.cs
├── Services
│   ├── Interfaces
│   └── Implementations
├── Resources
│   └── Book
├── Migrations
├── Program.cs
└── appsettings.json
```

---

# 🏗️ System Architecture

The backend follows a layered architecture to keep the application modular, scalable, and maintainable.

- **Controllers** expose RESTful API endpoints.
- **Services** contain the application's business logic.
- **Repositories** handle data access using Entity Framework Core.
- **DTOs** transfer data between the API and client.
- **Models** represent the database entities.
- **SignalR Hub** enables real-time notifications.
- **Hangfire** schedules background jobs to automatically restore book availability after the borrowing period expires.

---

# 🗄️ Database

The application uses **SQL Server** with **Entity Framework Core** following the **Code First** approach.

### Main Entities

- User
- Book
- AvailabilityDate
- BorrowRequest
- Comment
- Reaction
- ReadingList
- ReadingListBook
- Notification

---

# 📡 API Features

- RESTful API
- JWT Authentication
- ASP.NET Core Identity
- Role-based Authorization
- CRUD Operations
- File Upload for Book Cover Images
- Search, Filtering, and Sorting
- SignalR Real-Time Notifications
- Hangfire Background Jobs

---

# 🔄 Application Workflow

```text
Book Owner Registration
        │
        ▼
 Admin Approves Account
        │
        ▼
 Book Owner Creates Book
        │
        ▼
 Admin Approves Book
        │
        ▼
 Reader Browses Books
        │
        ▼
 Reader Sends Borrow Request
        │
        ▼
 Book Owner Accepts / Rejects
        │
        ▼
 Book Status → Borrowed
        │
        ▼
 Hangfire Schedules Return Date
        │
        ▼
 Borrow Duration Ends
        │
        ▼
 Book Status → Available
```

---

# 📌 Design Patterns & Principles

- Repository Pattern
- Dependency Injection
- Layered Architecture
- RESTful API Design
- SOLID Principles

---

# 🚀 Future Improvements

* Email notifications
* Advanced recommendation system
* Book reservation queue
* Chat between readers and book owners
* Rating system
* Book history and borrowing analytics
* Admin dashboard with statistics
* Mobile application

---

# 📌 Project Highlights

* Role-based authentication and authorization
* Admin moderation for users and books
* Book borrowing workflow
* Automatic availability restoration using a background service
* Real-time notifications with SignalR
* Advanced search, filtering, and sorting
* Reading lists
* Likes, dislikes, comments, and replies
  
---

# 👨‍💻 Developed By

**Mariam Atef**

Software Engineering Student  
Faculty of Computer Science and Artificial Intelligence  
Helwan University
