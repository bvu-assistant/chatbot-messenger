


class MessageBulder
{
    constructor()
    {

    }



    createButton({type, title, payload, url})
    {
        return (
        {
            type: type,
            title: title,
            payload: payload,
            url: url
        });
    }

    createDefaultAction({url, messenger_extensions = false, webview_height_ratio = 'tall'})
    {
        return (
        {
            type: 'web_url',
            url: url,
            messenger_extensions: messenger_extensions,
            webview_height_ratio: webview_height_ratio
        });
    }

    createGeneric({title, subtitle = "", image_url = "", default_action = null, buttons = []})
    {
        if (Array.isArray(buttons) === false)
        {
            buttons = [buttons];
        }
        

        if (buttons.length)
        {
            return (
            {
                "title": title,
                "image_url": image_url,
                "subtitle": subtitle,
                "default_action": default_action,
                "buttons": buttons
            });
        }


        return(
        {
            "title": title,
            "image_url": image_url,
            "subtitle": subtitle,
            "default_action": default_action
        });
    }

    createQuickReply({content_type, title = "", payload = "", image_url = ""})
    {
        return (
        {
            title: title,
            content_type: content_type,
            payload: payload,
            image_url: image_url
        });
    }

    createMediaAttachment({media_type, attachment_id})
    {
        return(
        {
            media_type: media_type,
            attachment_id: attachment_id
        });
    }



    createGenericTemplate({elements})
    {
        if (Array.isArray(elements) === false)
        {
            elements = [elements];
        }

        return(
        {
            "attachment":
            {
                "type": "template",
                "payload":
                {
                    "template_type": "generic",
                    "elements": elements
                }
            }
        });
    }

    createButtonTemplate({title, buttons})
    {
        if (Array.isArray(buttons) === false)
        {
            buttons = [buttons];
        }


        return(
        {
            "attachment":
            {
                "type": "template",
                "payload":
                {
                    "template_type": "button",
                    "text": title,
                    "buttons": buttons
                }
            }
        });
    }

    createMediaTemplate({attachments})
    {
        if (Array.isArray(attachments) === false)
        {
            attachments = [attachments];
        }


        return(
        {
            "attachment":
            {
                "type":"template",
                "payload":
                {
                    "template_type":"media",
                    "elements": attachments
                }
            }
        });
    }

    createQuickRepliesTemplate({title, quickReplies})
    {
        if (Array.isArray(quickReplies) === false)
        {
            quickReplies = [quickReplies];
        }


        return(
        {
            "text": title,
            "quick_replies": quickReplies
        });
    }
}


module.exports = MessageBulder;