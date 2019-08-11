const padLeft = require('pad-left')
const prettyBytes = require('prettier-bytes')
const prettyMs = require('pretty-ms')

const emojiLog = {
    warn: '⚠️',
    info: '✨',
    error: '🚨',
    debug: '🐛',
    fatal: '💀',
    trace: '🔍'
}

const levels = {
    10: 'trace',
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal'
}

const processDate = {
    parse (input, { colorizer, prettified }) {
        var date = new Date()
        var hours = padLeft(date.getHours().toString(), 2, '0')
        var minutes = padLeft(date.getMinutes().toString(), 2, '0')
        var seconds = padLeft(date.getSeconds().toString(), 2, '0')
        var prettyDate = hours + ':' + minutes + ':' + seconds
        prettified.date = colorizer(prettyDate, 'gray')
        return input
    },
    build (output, { prettified: { date } }) {
        output.push(date)
    }
}

const processLevel = {
    parse (input, { prettified }) {
        const emoji = emojiLog[levels[input.level]]
        const isWideEmoji = emoji !== '⚠️'
        const padding = isWideEmoji ? '' : ' '
        prettified.level = emoji + padding
        return input
    },
    build (output, { prettified: { level } }) {
        output.push(' ', level)
    }
}

const processMessage = {
    parse (input, { prettified, colorizer }) {
        prettified.message = colorizer(input.msg)
        return input
    },
    build (output, { prettified: { message } }) {
        output.push(' ', message)
    }
}

const processMethod = {
    parse (input, { prettified, colorizer }) {
        prettified.method = colorizer(input.req.method, 'white')
        prettified.statusCode = colorizer(input.res.statusCode || 'xxx', 'white')
        return input
    },
    build (output, { prettified: { method, statusCode } }) {
        if (method != null) {
            output.push(' ', method, ' ', statusCode)
        }
    }
}

const processUrl = {
    parse (input, { prettified, colorizer }) {
        const { url } = input.req
        if (url != null) {
            prettified.url = colorizer(url, 'white')
        }
        return input
    },
    build (output, { prettified: { url } }) {
        if (url != null) {
            output.push(' ', url)
        }
    }
}

const processResponseTime = {
    parse (input, { prettified, colorizer }) {
        const responseTime = input.responseTime || input.elapsed
        if (responseTime != null) {
            const elapsed = parseInt(responseTime, 10)
            const time = prettyMs(elapsed)
            prettified.responseTime = colorizer(time, 'gray')
        }
        return input
    },
    build (output, { prettified: { responseTime } }) {
        if (responseTime != null) {
            output.push(' ', responseTime)
        }
    }
}

const processContentLength = {
    parse (input, { colorizer, prettified }) {
        const { _contentLength } = input.res.raw
        if (_contentLength != null) {
            const bytes = parseInt(_contentLength, 10)
            const size = prettyBytes(bytes).replace(/ /, '')
            prettified.contentLength = colorizer(size, 'gray')
        }
        return input
    },
    build (output, { prettified: { contentLength } }) {
        if (contentLength != null) {
            output.push(' ', contentLength)
        }
    }
}

module.exports = {
    processDate,
    processLevel,
    processMessage,
    processMethod,
    processUrl,
    processResponseTime,
    processContentLength,
}
