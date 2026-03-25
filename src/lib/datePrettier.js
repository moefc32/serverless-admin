/*!
 * Copyright (c) 2024 Faizal Chan.
 * Licensed under the MIT License.

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export default function datePrettier(timestamp, options = {}) {
    if (!timestamp) return '-';
    let timestampMs;

    if (typeof timestamp === 'number') {
        timestampMs = (timestamp < 1e12)
            ? timestamp * 1000 : timestamp;
    } else if (timestamp instanceof Date) {
        timestampMs = timestamp.getTime();
    } else {
        timestampMs = new Date(timestamp).getTime();
    }

    const currentTime = new Date(timestampMs);
    if (isNaN(currentTime.getTime())) return '-';

    const {
        date = false,
        time = false,
        locale = 'en-US',
        separator = '-'
    } = options;

    const allowedLocales = ['en-US', 'id-ID'];
    const normalizedLocale
        = allowedLocales.includes(locale)
            ? locale : 'en-US';

    const dateOptionsMap = {
        long: {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        },
        short: {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }
    };

    const timeOptionsMap = {
        long: {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        },
        short: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }
    };

    let parts = [];

    if (date === true || date === 'short') {
        const normalizedDate =
            date === true ? 'long' : date;

        parts.push(
            currentTime.toLocaleDateString(
                normalizedLocale,
                dateOptionsMap[normalizedDate]
            ).trim()
        );
    }

    if (time === true || time === 'short') {
        const normalizedTime =
            time === true ? 'long' : time;

        parts.push(
            currentTime.toLocaleTimeString(
                normalizedLocale,
                timeOptionsMap[normalizedTime]
            )
        );
    }

    return parts.length
        ? parts.join(!!separator ? ` ${separator} ` : ' - ')
        : '-';
}
