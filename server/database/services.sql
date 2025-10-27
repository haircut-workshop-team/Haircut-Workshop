-- Clear old data (optional)
TRUNCATE TABLE services RESTART IDENTITY CASCADE;

-- Insert new seed data (sorted by service type)
INSERT INTO services (name, description, price, duration, image_url, is_active, created_at)
VALUES
-- Haircuts
('Men Haircut', 'Classic men haircut with fade or trim', 4.00, 30, 'https://plus.unsplash.com/premium_photo-1661288502656-7265af3e6b23?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170', TRUE, NOW()),
('Kids Haircut', 'Gentle haircut service for kids under 12 years old', 3.00, 25, 'https://images.unsplash.com/photo-1704072650662-76df3af134a7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687', TRUE, NOW()),

-- Beard
('Beard Trim', 'Professional beard shaping and trimming', 3.00, 15, 'https://images.unsplash.com/photo-1599011176306-4a96f1516d4d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1974', TRUE, NOW()),
('Beard Coloring', 'Natural dye to enhance beard color and texture', 4.00, 25, 'https://media.istockphoto.com/id/1718816726/photo/stylish-female-hairdresser-applying-beard-dyeing-to-client-anti-yellow-shampoo-jpg.jpg?s=2048x2048&w=is&k=20&c=bh-5f6i6vtJ5kOVmbqI9cPDc5U6N-je_qoMWYiijjhU=', TRUE, NOW()),

-- Hair Coloring
('Hair Coloring', 'Full hair coloring service with premium products', 8.00, 60, 'https://media.istockphoto.com/id/626069276/photo/man-at-the-hairdresser.jpg?s=1024x1024&w=is&k=20&c=wScxtr4pk0sAhuBf4r3F57pvwqOpNqsZTkEh9H6iVU=', TRUE, NOW()),

-- Styling
('Hair Styling', 'Professional hair styling for any occasion', 4.00, 20, 'https://media.istockphoto.com/id/2149437514/photo/barber-drying-a-clients-hair-with-hairdryer-in-the-barbershop.jpg?s=612x612&w=is&k=20&c=UGjqAPGAhq0MBpUKcgPtodMSavdFcb4rjQ1YxGsCt4Y=', TRUE, NOW()),

-- Spa
('Hair Spa', 'Deep nourishing treatment to restore hair strength and shine', 6.00, 45, 'https://media.istockphoto.com/id/2178374433/photo/modern-barber-shop.jpg?s=612x612&w=is&k=20&c=pvzXCroZZJYytGf2JvK7EJrAqVENDden5T7SPDGGK8o=', TRUE, NOW()),
('Hot Towel Shave', 'Traditional hot towel shave with premium blades', 3.00, 20, 'https://media.istockphoto.com/id/1061702628/photo/barber-shop.jpg?s=612x612&w=0&k=20&c=_8YaNbAD8d25usQCezB3HAlP2wRUdCiguoeycroFQFQ=', TRUE, NOW()),

-- Facial
('Facial Treatment', 'Deep cleansing facial for glowing, healthy skin', 5.00, 30, 'https://images.unsplash.com/photo-1734120273696-596f96658db9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=629', TRUE, NOW()),

-- Massage
('Head Massage', 'Relaxing scalp massage to relieve stress and tension', 3.00, 15, 'https://media.istockphoto.com/id/2198748660/photo/relaxed-man-enjoying-a-head-massage-in-a-serene-spa-setting-with-calming-candlelight-ambiance.jpg?s=2048x2048&w=is&k=20&c=9qajH6Ex-tUBHccxsbv-XcEoB6uSYFspJRpJRmLLBcw=', TRUE, NOW()),

-- Waxing
('Waxing', 'Facial or neck waxing with gentle touch', 3.00, 15, 'https://media.istockphoto.com/id/1271490234/photo/beautician-applies-wax-between-male-eyebrows.jpg?s=2048x2048&w=is&k=20&c=DHzXbAlT_cXkgPxrVeOjhV8HbvSXjahnAQvQEf2WfVI=', TRUE, NOW()),

-- Straightening
('Hair Straightening', 'Professional straightening with heat protection serum', 7.00, 60, 'https://plus.unsplash.com/premium_photo-1720363480581-7c9765c74627?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735', TRUE, NOW());
