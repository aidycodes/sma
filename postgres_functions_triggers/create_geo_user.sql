CREATE OR REPLACE FUNCTION f_create_geo_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO geo_user (id, userid)
VALUES (NEW.id, NEW.id);
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER t_create_geo_user
AFTER
INSERT ON auth_user FOR EACH ROW EXECUTE FUNCTION f_create_geo_user();