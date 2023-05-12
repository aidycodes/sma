CREATE OR REPLACE FUNCTION f_notify_followers() RETURNS TRIGGER AS $$
DECLARE poster TEXT;
notify_string TEXT;
id_payload TEXT;
BEGIN
SELECT INTO poster email
FROM auth_user
WHERE id = NEW.userid;
notify_string := format('%s just made a new post!', poster);
INSERT INTO post_notification (notificationid, postid, userid, content)
VALUES (
        NEW.postid,
        NEW.postid,
        NEW.userid,
        notify_string
    )
RETURNING notificationid INTO id_payload;
PERFORM pg_notify(
    'user_post',
    json_build_object(
        'userid',
        NEW.userid,
        'postid',
        NEW.postid,
        'type',
        'post',
        'content',
        notify_string
    )::text
);
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER t_notify_followers
AFTER
INSERT ON post FOR EACH ROW EXECUTE FUNCTION f_notify_followers();