import axios from 'axios';

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'https://hooks.slack.com/services/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';
//give url from after create a new webhooks
 const sendSlackNotification = async () => {
    try {
        
        const result = await axios.post(SLACK_WEBHOOK_URL, {
            text: "Whats going on?           Are u fired from our environment. Because u shared our personal details with other guys.",
        })
        console.log('result', +result)
        ;
    } catch (error) {
        console.error('Failed to send Slack notification:', error);
    }


}
sendSlackNotification();