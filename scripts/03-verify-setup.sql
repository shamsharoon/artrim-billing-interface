-- Verify the database setup
SELECT 'Checking tables...' as status;

-- Check if tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('clients', 'invoices', 'invoice_items');

-- Check foreign key constraints
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
AND tc.table_name IN ('invoices', 'invoice_items');

-- Check data counts
SELECT 'clients' as table_name, COUNT(*) as record_count FROM clients
UNION ALL
SELECT 'invoices' as table_name, COUNT(*) as record_count FROM invoices
UNION ALL
SELECT 'invoice_items' as table_name, COUNT(*) as record_count FROM invoice_items;

-- Test a simple join
SELECT 
    i.invoice_number,
    c.name as client_name,
    COUNT(ii.id) as item_count
FROM invoices i
JOIN clients c ON i.client_id = c.id
LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
GROUP BY i.id, i.invoice_number, c.name
ORDER BY i.invoice_number;
