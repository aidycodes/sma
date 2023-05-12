CREATE OR REPLACE FUNCTION f_notify_user() RETURNS TRIGGER AS $$ BEGIN PERFORM pg_notify(
        'notification',
        json_build_object(
            'userid',
            NEW.userid,
            'type',
            NEW.type,
            'content',
            NEW.content
        )::text
    );
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER t_notify_user
AFTER
INSERT ON notify_user FOR EACH ROW EXECUTE FUNCTION f_notify_user();