const fetch = require('isomorphic-fetch');
var child_process = require('child_process');
let api_url = 'https://www.kanald.com.tr/actions/content/media/';
let args = process.argv.slice(2);
args.map((url, index) => {
    fetch(url).then(async function (response) { return response.text() }).then(function (data) {
        var matches = data.match(/data-id="(.*?)"/gm)
        let show_id = matches[2];
        show_id = show_id.substring(9, show_id.length - 1);
        fetch(api_url + show_id).then(function (response) { return response.json() }).then(function (api_data) {
            let video_data = api_data.Media.Link
            let video_link = video_data.ServiceUrl + '/' + video_data.SecurePath;
            let bash_command = `ffmpeg -i ${video_link} -c copy -bsf:a aac_adtstoasc + ${index} .mp4`
            console.log("Download has started.")
            child_process.exec(bash_command, function (err, stdout, stderr) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log(stdout);
            })
        })
    })
})