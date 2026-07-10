-- Create database
CREATE DATABASE IF NOT EXISTS geo_rides;
USE geo_rides;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    api_token VARCHAR(255) UNIQUE,
    profile_photo VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 4.5,
    total_rides INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_token (api_token)
);

-- Bookings table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    driver_id INT,
    pickup_location VARCHAR(255) NOT NULL,
    drop_location VARCHAR(255) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    estimated_fare DECIMAL(10,2),
    actual_fare DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, in_progress, completed, cancelled
    pickup_lat DECIMAL(10,8),
    pickup_lng DECIMAL(11,8),
    drop_lat DECIMAL(10,8),
    drop_lng DECIMAL(11,8),
    scheduled_time DATETIME,
    started_at DATETIME,
    completed_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL,
    INDEX idx_booking_id (booking_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Drivers table
CREATE TABLE drivers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    profile_photo VARCHAR(255),
    rating DECIMAL(2,1) DEFAULT 4.5,
    total_rides INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'offline', -- online, offline, on_ride
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_vehicle_number (vehicle_number),
    INDEX idx_status (status)
);

-- Reviews/Ratings table
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    driver_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (booking_id)
);

-- Payments table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- card, upi, wallet, cash
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status)
);

-- Wallets table
CREATE TABLE wallets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Student discounts table
CREATE TABLE student_discounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    discount_percentage INT DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    verified_at DATETIME,
    expires_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_drivers_created_at ON drivers(created_at);

-- Insert sample drivers
INSERT INTO drivers (full_name, email, phone, password, vehicle_type, vehicle_number, license_number, is_verified, rating) VALUES
('Ramesh Kumar', 'ramesh@example.com', '+919876543210', '$2y$10$example', 'cab', 'DL-01-AB-1234', 'DL123456789', TRUE, 4.9),
('Priya Singh', 'priya@example.com', '+919876543211', '$2y$10$example', 'bike', 'DL-01-CD-5678', 'DL987654321', TRUE, 4.8),
('Aditya Patel', 'aditya@example.com', '+919876543212', '$2y$10$example', 'auto', 'DL-01-EF-9012', 'DL456789012', TRUE, 4.7);
