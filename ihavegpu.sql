-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 24, 2025 at 12:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ihavegpu`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `category_name`) VALUES
(1, 'Computer'),
(2, 'Laptop'),
(3, 'CPU'),
(4, 'GPU'),
(5, 'Mainboard'),
(6, 'Ram'),
(7, 'SSD & HHD'),
(8, 'Power supply'),
(9, 'Case'),
(10, 'Cooling kit'),
(11, 'Monitor');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','completed','cancelled') DEFAULT 'pending',
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `product_name` varchar(100) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `product_name`, `brand`, `description`, `price`, `stock`, `image_url`, `created_at`) VALUES
(1, 2, 'MSI THIN 15 B13UC-3266TH (COSMOS GRAY)', 'MSI', 'Brand: MSI\r\nModel: THIN 15 B13U\r\n\r\nProcessor: Intel® Core™ i5-13420H (13th Gen)\r\nProcessor Speed: 2.1GHz (up to 4.6GHz), 12MB Intel Smart Cache\r\n\r\nGraphics: NVIDIA® GeForce RTX™ 3050 Laptop GPU 4GB GDDR6\r\n\r\nDisplay: 15.6\" FHD (1920 x 1080) IPS, 144Hz, 45% NTSC\r\n\r\nMemory: 16GB (8GB x2) DDR4 3200MHz\r\nMemory Slots: 2x DDR4 Slots\r\nMaximum Memory: 64GB\r\n\r\nStorage: 512GB PCIe® NVMe™ M.2 SSD\r\n\r\nOperating System: Windows 11 Home\r\n\r\nCamera: HD type (30fps @ 720p)\r\n\r\nConnectivity / Ports:\r\n\r\n1 x HDMI™ port\r\n\r\n3 x USB 3.2 Gen 1 Type-A ports\r\n\r\n1 x USB 3.2 Gen 1 Type-C port\r\n\r\n1 x Headphone-out\r\n\r\n1 x Mic-in\r\n\r\n1 x RJ45 LAN port\r\n\r\nWireless: Wi-Fi 6E (802.11ax) + Bluetooth 5.3\r\n\r\nBattery: 3-Cell, 52.4WHr\r\n\r\nColor: Cosmos Gray\r\n\r\nDimensions: 359 x 254 x 21.7 mm\r\nWeight: 1.86 kg\r\n\r\nWarranty: 2 Years', 21990.00, 3, '/upload/image-1761142436853.jpg', '2025-10-22 14:13:56'),
(2, 3, 'CPU AMD AM4 RYZEN 5 5500 3.6GHz 6C 12T', 'AMD', 'CPU Specifications\r\n\r\nBrand: AMD\r\n\r\nSeries: 5000 Series\r\n\r\nProcessor Number: Ryzen 5 5500\r\n\r\nSocket Type: AM4\r\n\r\nCores / Threads: 6 Cores / 12 Threads\r\n\r\nBase Frequency: 3.6 GHz\r\n\r\nMax Turbo Frequency: 4.2 GHz\r\n\r\nL2 Cache: 3 MB\r\n\r\nL3 Cache: 16 MB\r\n\r\nGraphics Models: Discrete Graphics Card Required\r\n\r\n64-Bit Support: N/A\r\n\r\nCPU Cooler: Yes\r\n\r\nDefault TDP: 65W\r\n\r\nWarranty: 3 Years', 2490.00, 4, '/upload/image-1761142788224.jpg', '2025-10-22 14:19:48'),
(3, 3, 'CPU AMD AM4 RYZEN 5 5600 3.5GHz 6C 12T', 'AMD', 'Brand: AMD\r\n\r\nSeries: 5000 Series\r\n\r\nProcessor Number: Ryzen 5 5600\r\n\r\nSocket Type: AM4\r\n\r\nCores / Threads: 6 Cores / 12 Threads\r\n\r\nBase Frequency: 3.5 GHz\r\n\r\nMax Turbo Frequency: 4.4 GHz\r\n\r\nL2 Cache: 3 MB\r\n\r\nL3 Cache: 32 MB\r\n\r\nGraphics Models: Discrete Graphics Card Required\r\n\r\n64-Bit Support: N/A\r\n\r\nCPU Cooler: Yes\r\n\r\nDefault TDP: 65W\r\n\r\nWarranty: 3 Years', 2990.00, 4, '/upload/image-1761214646583.jpg', '2025-10-23 10:17:26'),
(4, 3, 'CPU AMD AM4 RYZEN 5 5500GT 3.6GHz 6C 12T', 'AMD', 'Brand: AMD\r\n\r\nSeries: 5000 Series\r\n\r\nProcessor Number: Ryzen 5 5500GT\r\n\r\nSocket Type: AM4\r\n\r\nCores / Threads: 6 Cores / 12 Threads\r\n\r\nBase Frequency: 3.6 GHz\r\n\r\nMax Turbo Frequency: 4.4 GHz\r\n\r\nL2 Cache: 3 MB\r\n\r\nL3 Cache: 16 MB\r\n\r\nGraphics Models: AMD Radeon™ Graphics\r\n\r\n64-Bit Support: N/A\r\n\r\nCPU Cooler: Yes\r\n\r\nMaximum Turbo Power: 65 Watt\r\n\r\nWarranty: 3 Years', 3690.00, 5, '/upload/image-1761214761484.jpg', '2025-10-23 10:19:21'),
(5, 3, 'CPU INTEL 1851 CORE ULTRA 5 225F 3.3GHz 10C 10T (3Y)', 'INTEL', 'Brand: INTEL\r\n\r\nSeries: CORE ULTRA 5 Processors\r\n\r\nProcessor Number: ULTRA 5 225F\r\n\r\nSocket Type: LGA 1851\r\n\r\nCores / Threads: 10 (6P+4E) Cores / 10 Threads\r\n\r\nBase Frequency: 3.3 GHz\r\n\r\nMax Turbo Frequency: 4.9 GHz\r\n\r\nL2 Cache: 22 MB\r\n\r\nL3 Cache: 20 MB Intel® Smart Cache\r\n\r\nGraphics Models: Intel® Ultra 5\r\n\r\nCPU Cooler: N/A\r\n\r\nDefault TDP: 65W\r\n\r\nMaximum Turbo Power: 121W\r\n\r\nWarranty: 3 Years', 5090.00, 4, '/upload/image-1761214856225.jpg', '2025-10-23 10:20:56'),
(6, 3, 'CPU AMD AM5 RYZEN 5 8500G 3.5GHz 6C 12T', 'AMD', 'Brand: AMD\r\n\r\nSeries: 8000 Series\r\n\r\nProcessor Number: Ryzen 5 8500G\r\n\r\nSocket Type: AM5\r\n\r\nCores / Threads: 6 Cores / 12 Threads\r\n\r\nBase Frequency: 3.5 GHz\r\n\r\nMax Turbo Frequency: 5.0 GHz\r\n\r\nL2 Cache: 6 MB\r\n\r\nL3 Cache: 16 MB\r\n\r\nGraphics Models: AMD Radeon™ 740M\r\n\r\n64Bit Support: N/A\r\n\r\nCPU Cooler: Yes\r\n\r\nDefault TDP: 65W\r\n\r\nMaximum Turbo Power: 65 Watt\r\n\r\nWarranty: 3 Years', 5390.00, 5, '/upload/image-1761214927276.jpg', '2025-10-23 10:22:07'),
(7, 1, 'OCTD4-001 AMD RYZEN 5 5500GT 3.6GHz 6C/12T / A520M / ONBOARD / 16GB DDR4 3200MHz / M.2 512GB / 550W ', '', 'CPU: AMD Ryzen™ 5 5500GT 3.6GHz 6C/12T (3Y)\r\nMainboard: MSI A520M-A-PRO (3Y)\r\nGraphic Card: AMD RADEON GRAPHICS (อัพเกรดการ์ดจอติดต่อ ADMIN)\r\nMemory: GeIL ORION PHANTOM GAMING 16GB (8x2) DDR4 3200MHz GRAY (LT)\r\nStorage: M.2 LEXAR NQ780 512GB Read (5,000 MB/s) (5Y)\r\nPower Supply: AZZA PSAZ 550W (80+ BRONZE) (3Y)\r\nCase: GIGABYTE C102 GLASS (BLACK) (mATX) (1Y)', 10490.00, 3, '/upload/image-1761215385861.jpg', '2025-10-23 10:29:45'),
(8, 1, 'OCTD4-003 INTEL I5-12400 2.5GHz 6C/12T / H610M / ONBOARD / 16GB DDR4 3200MHz / M.2 512GB / 550W (80+', '', 'CPU: Intel® CORE I5-12400 2.5GHz 6C/12T (3Y)\r\nMainboard: ASROCK H610M-H2/M.2-D4 (3Y)\r\nGraphic Card: INTEL UHD GRAPHICS 730 (อัพเกรดการ์ดจอติดต่อ ADMIN)\r\nMemory: GeIL ORION PHANTOM GAMING 16GB (8x2) DDR4 3200MHz GRAY (LT)\r\nStorage: M.2 LEXAR NQ780 512GB Read (5,000 MB/s) (5Y)\r\nPower Supply: AZZA PSAZ 550W (80+ BRONZE) (3Y)\r\nCase: iHAVECPU INFINITY MINI (BLACK) (mATX) (1Y)', 11490.00, 3, '/upload/image-1761215464576.jpg', '2025-10-23 10:31:04'),
(9, 1, 'OCTD4-007 AMD RYZEN 5 5500 3.6GHz 6C/12T / A520M / RX 6500 XT 4GB / 16GB DDR4 3200MHz / M.2 512GB / ', '', 'CPU: AMD Ryzen™ 5 5500 3.6GHz 6C/12T (3Y)\r\nMainboard: ASROCK A520M-HVS (3Y)\r\nGraphic Card: POWERCOLOR FIGHTER RADEON RX 6500 XT - 4GB GDDR6 V3 (3Y)\r\nMemory: GeIL ORION PHANTOM GAMING 16GB (8x2) DDR4 3200MHz GRAY (LT)\r\nStorage: M.2 LEXAR NQ780 512GB Read (5,000 MB/s) (5Y)\r\nPower Supply: AZZA PSAZ 550W (80+ BRONZE) (3Y)\r\nCase: GIGABYTE C102 GLASS (BLACK) (mATX) (1Y)', 13990.00, 5, '/upload/image-1761215539690.jpg', '2025-10-23 10:32:19'),
(10, 1, 'OCTINTD5-006 INTEL I5-14400F 4.7GHz 10C/16T / B760M / RTX 3050 6GB / 32GB DDR5 5600MHz / M.2 1TB / 6', '', 'CPU: Intel® CORE I5-14400F 4.7GHz 10C/16T (3Y)\r\nMainboard: ASUS PRIME B760M-A (3Y)\r\nGraphic Card: INNO3D GEFORCE RTX 3050 TWIN X2 V2 - 6GB GDDR6 (3Y)\r\nMemory: CORSAIR VENGEANCE 32GB (16x2) DDR5 5600MHz WHITE (LT)\r\nStorage: M.2 LEXAR NQ780 1TB Read (6,500 MB/s) (5Y)\r\nPower Supply: MSI MAG A600DN 600W BULK (80+WHITE) (3Y)\r\nCase: iHAVECPU IHC R03 (WHITE) (mATX) (1Y)\r\nCooling System: iHAVECPU RK500 DIGITAL TEMP WHITE (1Y)', 21990.00, 5, '/upload/image-1761215754255.jpg', '2025-10-23 10:35:54'),
(11, 1, 'OCTAMDD5-005 AMD RYZEN 5 7500F 3.7GHz 6C/12T / B650M / RTX 3050 6GB / 32GB DDR5 5600MHz / M.2 1TB / ', '', 'CPU: AMD Ryzen™ 5 7500F 3.7GHz 6C/12T (MPK) (3Y)\r\nMainboard: ASROCK B650M PG (LN) DDR5 (3Y)\r\nGraphic Card: INNO3D GEFORCE RTX 3050 TWIN X2 V2 - 6GB GDDR6 (3Y)\r\nMemory: CORSAIR VENGEANCE 32GB (16x2) DDR5 5600MHz BLACK (LT)\r\nStorage: M.2 LEXAR NQ780 1TB Read (6,500 MB/s) (5Y)\r\nPower Supply: FSP HV+ 600W (80+WHITE) (3Y)\r\nCase: iHAVECPU IHC R03 (BLACK) (mATX) (1Y)', 21990.00, 5, '/upload/image-1761215822359.jpg', '2025-10-23 10:37:02'),
(12, 2, 'NOTEBOOK ACER NITRO LITE16 NL16-71G-56RJ (PEARL WHITE) (3Y)', 'ACER', 'Brand: ACER\r\nModel: NITRO LITE16\r\nProcessor: Intel® Core™ i5-13420H (13th Gen)\r\nProcessor Speed: 2.1 GHz (12MB Cache, up to 4.6 GHz, 8 cores, 12 Threads)\r\nVideo Graphics: NVIDIA® GeForce RTX™ 2050 Laptop GPU 4GB GDDR6\r\nScreen Size: 16\"\r\nDisplay: WUXGA (1920x1200), 16:10, IPS, 165Hz, NTSC 45%\r\nMemory: 16GB DDR5 (1x DDR5 Slot)\r\nStorage: 512GB PCIe® 4.0 NVMe™ M.2 SSD\r\nOperating System: Windows 11 Home\r\nCamera: Acer Webcam\r\nOptical Drive: No\r\nConnection Ports:\r\n\r\n1 x HDMI™ port\r\n\r\n2 x USB 3.2 Gen 1 Type-A ports\r\n\r\n1 x RJ45 LAN port\r\n\r\n1 x Headphone\r\n\r\n1 x USB 3.2 Gen 2 10Gbps Type-C\r\nWi-Fi / Bluetooth: Wi-Fi 6, 11ax 2x2 + BT5.0\r\nBattery: 3-Cell Li-ion, 53WHrs\r\nColor: PEARL WHITE\r\nDimensions: 362.2 x 248.47 x 22.9 mm\r\nWeight: 1.95 kg\r\nWarranty: 3 Years', 20990.00, 5, '/upload/image-1761215972846.jpg', '2025-10-23 10:39:32'),
(13, 2, 'NOTEBOOK ACER ASPIRE 7 A715-59G-54H5 (BLACK) (3Y)', 'ACER', 'Brand: ACER\r\nModel: ASPIRE 7\r\nProcessor: Intel® Core™ i5-12450H (12th Gen)\r\nProcessor Speed: 2.0 GHz (up to 4.4 GHz, 12MB Intel Smart Cache)\r\nVideo Graphics: NVIDIA® GeForce RTX™ 3050 Laptop GPU 6GB GDDR6\r\nScreen Size: 15.6\"\r\nDisplay: FHD (1920x1080), 16:9, IPS, 144Hz, Acer ComfyView™ LED backlit TFT LCD\r\nMemory: 16GB (16GB x1) DDR4 SO-DIMM\r\nStorage: 512GB PCIe® 4.0 NVMe™ M.2 SSD\r\nOperating System: Windows 11 Home\r\nCamera: HD camera 720p (HD audio/video recording)\r\nOptical Drive: No\r\nConnection Ports:\r\n\r\n1 x HDMI™ port\r\n\r\n1 x USB 3.2 Gen 1 port\r\n\r\n1 x USB 2.0 port\r\n\r\n1 x Mini DisplayPort\r\n\r\n1 x Headphone / microphone combo jack (3.5mm)\r\n\r\n1 x microSD card reader\r\n\r\n2 x USB Type-C port\r\nWi-Fi / Bluetooth: Wi-Fi 6 (802.11ax) + Bluetooth 5.1\r\nBattery: 4-Cell, 54.8WHr\r\nColor: BLACK\r\nDimensions: 359.5 x 238 x 22.7 mm\r\nWeight: 1.99 kg', 20990.00, 5, '/upload/image-1761216070516.jpg', '2025-10-23 10:41:10'),
(14, 2, 'NOTEBOOK LENOVO LOQ 15IAX9E 83LK002NTA (LUNA GREY) (2Y)', 'LENOVO', 'Brand: LENOVO\r\nModel: LOQ 15IAX9E\r\nProcessor: Intel® Core™ i5-12450HX (12th Gen)\r\nProcessor Speed: 8C (4P + 4E) / 12T, P-core up to 4.4GHz, E-core up to 3.1GHz, 12MB\r\nVideo Graphics: NVIDIA® GeForce RTX™ 3050 Laptop GPU 6GB GDDR6\r\nScreen Size: 15.6\"\r\nDisplay: FHD (1920x1080), IPS 300 nits Anti-glare, 100% sRGB, 144Hz\r\nMemory: 16GB (16GB x1) DDR5 4800MHz\r\nMemory Slots: 1x DDR5 SO-DIMM Slot\r\nMax Memory: Up to 32GB DDR5 4800MHz\r\nStorage: 512GB PCIe® 4.0 NVMe™ M.2 SSD\r\nOperating System: Windows 11 Home\r\nCamera: HD 720p with Privacy Shutter\r\nOptical Drive: No\r\nConnection Ports:\r\n\r\n1 x RJ-45 port\r\n\r\n1 x USB 3.2 Gen 1 5Gbps Type-C\r\n\r\n2 x USB 3.2 Gen 1 5Gbps Type-A\r\n\r\n1 x HDMI™ 2.1 (up to 8K/60Hz)\r\n\r\n1 x Headphone / microphone combo jack (3.5mm)\r\n\r\n1 x Power connector\r\n\r\n1 x Card reader\r\nWi-Fi / Bluetooth: Wi-Fi 6 11ax, 2x2 + BT5.2\r\nBattery: 57WHr (Integrated)\r\nColor: Luna Grey\r\nDimensions: 359.3 x 236 x 19.9–22.95 mm\r\nWeight: 1.75 kg\r\nWarranty: 2 Years', 21990.00, 4, '/upload/image-1761216138270.jpg', '2025-10-23 10:42:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(60) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `create_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `role`, `create_at`) VALUES
(1, 'Admin', 'meawdamxza@gmail.com', '$2b$10$B5kB884qvAKwWW6eg7Y7OuSenRO0XXxacqptDGU1Z0s8YcKI.dCAC', 'admin', '2025-10-15 17:27:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
