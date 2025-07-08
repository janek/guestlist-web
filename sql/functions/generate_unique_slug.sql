-- This is used from a Trigger on insertion into the Links table
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    new_slug TEXT;
    i INT;
BEGIN
    LOOP
        -- Generate a new slug by randomly selecting characters from the character set
        new_slug := '';
        FOR i IN 1..6 LOOP
            new_slug := new_slug || substring(chars FROM floor(random() * length(chars) + 1)::int FOR 1);
        END LOOP;

        -- Check if the slug already exists
        IF NOT EXISTS (SELECT 1 FROM links WHERE slug = new_slug) THEN
            NEW.slug := new_slug;
            RETURN NEW;
        END IF;
    END LOOP;
END;