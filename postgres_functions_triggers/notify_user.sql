CREATE OR REPLACE FUNCTION f_notify_user() RETURNS TRIGGER AS $$ BEGIN PERFORM pg_notify(
        'notification',
        json_build_object(
            'id',
            NEW.nofiy_user_id,
            'userid',
            NEW.userid,
            'type',
            NEW.type,
            'content',
            NEW.content,
            'commentid',
            NEW.commentid
        )::text
    );
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER t_notify_user
AFTER
INSERT ON notify_user FOR EACH ROW EXECUTE FUNCTION f_notify_user();