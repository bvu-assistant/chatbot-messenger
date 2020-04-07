


class MessageBulder
{
    constructor()
    {

    }


    createGenericTemplate(elements)
    {
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

    createButtonTemplate(title, buttons)
    {
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

    createMediaTemplate(attachments)
    {
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

    createQuickReply(title, quickReplies)
    {
        return(
        {
            "text": title,
            "quick_replies": quickReplies
        });
    }
}


module.exports = MessageBulder;