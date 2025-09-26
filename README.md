# Sweet Shop Project

**Developer:** Tilakraj Singh Ranawat 
**Roll No:** 23223092  
**Organization Assignment:** Incubytes  

---

## Project Overview

Sweet Shop is a full-stack web application designed to manage and purchase sweets online. The backend is developed using **Spring Boot**, while the frontend is built using **React with TypeScript and Tailwind CSS**.

---

## Folder Structure

### Frontend (`sweetshop-frontend`)

```bash
src/
├─ assets/
├─ components/
│   ├─ auth/
│   │   ├─ LoginForm.tsx
│   │   └─ RegisterForm.tsx
│   ├─ common/
│   │   ├─ Navbar.tsx
│   │   └─ ProtectedRoute.tsx
│   └─ sweets/
│       ├─ SearchBar.tsx
│       ├─ SweetCard.tsx
│       └─ SweetForm.tsx
├─ context/
│   └─ AuthContext.tsx
├─ hooks/
├─ pages/
│   ├─ LoginPage.tsx
│   ├─ RegisterPage.tsx
│   └─ SweetsPage.tsx
├─ services/
│   └─ api.ts
├─ types/
├─ App.tsx
└─ main.tsx
```

### Backend (`sweetshop_Incubyte`)
```bash
src/main/java/com/example/sweetshop/
├─ controller/
│   ├─ AuthController.java
│   └─ SweetController.java
├─ config/
│   └─ SecurityConfig.java
├─ dto/
│   ├─ AuthRequest.java
│   ├─ LoginResponse.java
│   ├─ RegisterRequest.java
│   └─ SweetDto.java
├─ entity/
│   ├─ Sweet.java
│   └─ Users.java
├─ exception/
├─ mapper/
├─ repository/
├─ security/
├─ service/
└─ SweetshopApplication.java

````

---

## Technologies Used

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios
- React Router DOM

**Backend:**
- Spring Boot 3.5.6
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT (JSON Web Tokens)
- Lombok
- Springdoc OpenAPI

---

## AI Tools Used

- **ChatGPT:** Assisted in generating project README content and clarifying React + Spring Boot integration patterns.
- **GitHub Copilot:** Helped generate boilerplate code for React components, API services, and backend DTOs.
- **Deepseek:** Brainstormed API endpoint structures and suggested frontend-backend interaction flows.

**Reflection:**  
AI significantly accelerated development by providing templates, solving syntax issues, and offering suggestions for both frontend and backend integration. It reduced repetitive coding tasks and allowed me to focus on implementing core functionalities.

---

## Installation & Setup

### Backend Setup

1. Make sure you have **Java 21** and **Maven** installed.
2. Clone the repository
```bash
   git clone sweetshop/sweetshop_backend/
   cd sweetshop-backend
````

3. Install dependencies:

```bash
mvn clean install
```
4. Configure PostgreSQL database in `application.properties` (or `application.yml`):

  ```properties
  spring.datasource.url=jdbc:postgresql://localhost:5432/sweetshop
  spring.datasource.username=your_username
  spring.datasource.password=your_password
  spring.jpa.hibernate.ddl-auto=update
  ```
5. Run the backend:

```bash
mvn spring-boot:run
```
6. The backend runs at: `http://localhost:8080`

### Frontend Setup

1. Make sure you have **Node.js >= 20** and **npm** installed.
2. Navigate to the frontend directory:

   ```bash
   cd sweetshop-frontend
   ```
3. Install dependencies:

   ```bash
   npm install
   ```
4. Start the frontend in development mode:

   ```bash
   npm run dev
   ```
5. The frontend runs at: `http://localhost:5000`

---

## Usage

1. Register a new user via the registration page.
2. Login using registered credentials.
3. Browse sweets, search for your favorites, and manage purchases.
4. Admin functionalities (add/update sweets) can be accessed via dedicated endpoints.

---

