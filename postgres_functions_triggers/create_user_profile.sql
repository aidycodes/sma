CREATE OR REPLACE FUNCTION f_create_user_profile() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO user_profile (profileid, userid)
VALUES (NEW.id, NEW.id);
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER t_create_user_profile
AFTER
INSERT ON auth_user FOR EACH ROW EXECUTE FUNCTION f_create_user_profile();