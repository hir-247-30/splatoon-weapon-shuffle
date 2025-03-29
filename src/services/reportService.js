import axios from 'axios';
export function reportByDiscord(reports) {
    const content = buildMessage(reports);
    const requestOptions = {
        url: process.env['DISCORD_WEBHOOK_URL'],
        method: 'POST',
        data: { content },
        headers: { 'Content-Type': 'application/json' },
    };
    axiosRequest(requestOptions);
}
function buildMessage(reports) {
    let message = 'ブキチョイス';
    reports.forEach(report => {
        message += `\n${report.player_name}さんのブキは、「${report.weapon_name}」です`;
    });
    return message;
}
async function axiosRequest(requestOptions) {
    return axios(requestOptions)
        .then((res) => {
        return res.data;
    })
        .catch((e) => {
        console.log(e.message);
    });
}
