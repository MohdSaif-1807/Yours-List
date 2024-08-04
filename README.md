# Yours List

**Yours List** is a MERN Stack web application designed to manage and track daily tasks. This multi-user application allows users to create, manage, and organize their tasks efficiently. It supports CRUD (Create, Read, Update, Delete) operations and offers different access levels for normal users and administrators.

## Features

- **User Roles**: 
  - **Normal Users**: Create, edit, and delete Todo categories and tasks.
  - **Admin Users**: Monitor and manage user activity, including details like IP address, session ID, login time, and logout time.

- **Todo Categories**: Organize tasks under different categories (e.g., Gym with sub-tasks like Biceps, Triceps).

- **CRUD Operations**: Full support for creating, reading, updating, and deleting tasks.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT) for user authentication

## Installation

To get started with **Yours List**, follow these steps:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/MohdSaif-1807/Yours-List.git
    cd Yours-List
    ```

2. **Install Dependencies**:

    Navigate to the server and client directories and install the necessary dependencies:

    ```bash
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

3. **Start the Application**:

    Start the server and client applications:

    ```bash
    # In the backend directory
    npm start

    # In the frontend directory
    npm start
    ```

    The backend should now be running on specified port number in .env eg: for PORT=5000 `http://localhost:5000` and the frontend on `http://localhost:3000`.

## Usage

1. **Normal Users**:
   - Sign up and log in to access the Todo dashboard.
   - Create new Todo categories and tasks.
   - Edit and delete tasks as needed.

2. **Admin Users**:
   - Access the admin dashboard to monitor user activities.
   - View user details such as IP addresses, session IDs, login times, and logout times.
  

   
## UI Images

1. Registration page:
   
   ![image](https://github.com/user-attachments/assets/0f7d5268-5dd2-4f63-a779-6cc7aaebc055)


2. Login page:
   
   ![image](https://github.com/user-attachments/assets/88c28cec-a636-4ab7-8f7b-ac668e467f75)


3. Your-List(Normal user) homepage:

    ![image](https://github.com/user-attachments/assets/258176fd-13a5-4417-a08c-21333c7e776a)


4. Category creation (Normal user):
 
   ![image](https://github.com/user-attachments/assets/842b9de2-991e-42a7-83ef-3db57a2b5abf)


5. Category created (Normal user):
 
   ![image](https://github.com/user-attachments/assets/c3180064-29a1-4635-997a-c79407fafe34)


6. Creation of Todo Item (Normal user):
 
   ![image](https://github.com/user-attachments/assets/2c5f5de8-7679-47c6-851c-2da791ff5472)


7. Added Todo Item Successfully (Normal user):
 
   ![image](https://github.com/user-attachments/assets/46daa9fd-36a3-4556-82fd-c9fcc514a18d)


8. Editing a Todo Item (Normal user):
 
   ![image](https://github.com/user-attachments/assets/d6b8e4d1-3da7-4012-b422-ad85e20300ae)


9. Todo item edited successfully (Normal user):
 
    ![image](https://github.com/user-attachments/assets/41ffafa3-24d9-4f67-8ebb-e035bcb7e4fa)


10. Deleting todo item (Normal user):
  
    ![image](https://github.com/user-attachments/assets/0187a7e8-81c0-4510-948f-ca844dd9e7ce)


11. Todo item deleted successfully (Normal user):
  
    ![image](https://github.com/user-attachments/assets/bd6aa8d0-e130-428f-883f-934f72082001)


12. Admin dashboard (Admin)
  
    ![image](https://github.com/user-attachments/assets/23831f35-d644-4c3d-826a-21d07a009688)




