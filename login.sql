CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    isVerified BIT DEFAULT 0
);


SELECT * FROM Users; 


-- Check the table
SELECT * FROM Addresses;


CREATE TABLE Addresses (
  id INT IDENTITY(1,1) PRIMARY KEY,
  userId INT NOT NULL,
  fullName NVARCHAR(150) NOT NULL,
  label NVARCHAR(50) NOT NULL DEFAULT 'Home',
  street NVARCHAR(255) NOT NULL,
  city NVARCHAR(100),
  state NVARCHAR(100),
  postalCode NVARCHAR(20) NOT NULL,
  country NVARCHAR(100),
  createdAt DATETIME DEFAULT GETDATE(),
  updatedAt DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);



CREATE TABLE Cart (
  id INT PRIMARY KEY IDENTITY(1,1),
  userId INT NOT NULL,
  productId INT NOT NULL,
  title NVARCHAR(255),
  price DECIMAL(10,2),
  image NVARCHAR(255),
  quantity INT NOT NULL DEFAULT 1
);

SELECT * FROM Cart;

CREATE TABLE Wishlist (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    ProductId INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Image NVARCHAR(255) NULL,
    Price DECIMAL(10, 2) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

select*from Wishlist;

ALTER TABLE Wishlist
ADD CONSTRAINT UQ_User_Product UNIQUE (UserId, ProductId);



CREATE TABLE help_requests (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    message NVARCHAR(MAX) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);

select*from help_requests;

-- Orders table
CREATE TABLE Orders (
    id INT IDENTITY(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    addressId INT NOT NULL,
    paymentMethod NVARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status NVARCHAR(50) DEFAULT 'Pending',
    createdAt DATETIME DEFAULT GETDATE()
);

-- OrderItems table
CREATE TABLE OrderItems (
    id INT IDENTITY(1,1) PRIMARY KEY,
    orderId INT NOT NULL,
    productId INT NOT NULL,
    title NVARCHAR(255),
    price DECIMAL(10,2),
    quantity INT NOT NULL,
    FOREIGN KEY (orderId) REFERENCES Orders(id)
);

select * from Orders;

select * from OrderItems;