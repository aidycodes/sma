CREATE OR REPLACE FUNCTION f_notify_chat() RETURNS TRIGGER AS $$ BEGIN PERFORM pg_notify(
        'chat',
        json_build_object(
            'content',
            NEW.content,
            'chatid',
            NEW.chatid,
            'userid',
            NEW.userid,
            'messageid',
            NEW.messageid
        )::text
    );
RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER t_notify_chat
AFTER
INSERT ON chat_message FOR EACH ROW EXECUTE FUNCTION f_notify_chat();