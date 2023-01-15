
import $ from 'jquery'
import { Notification } from '../../interfaces/MastodonApiReturns'
import { toast } from '../common/declareM'
import lang from '../common/lang'
import { playSound } from '../platform/end'
import { escapeHTML, statusModel, stripTags } from '../platform/first'
import { date, IDateType, isDateType } from './date'
const dateType = localStorage.getItem('datetype') || 'absolute'
import { customEmojiReplace, INotf, parse } from './parse'

const native = (localStorage.getItem('nativenotf') || 'yes') === 'yes'
const gif = (localStorage.getItem('gif') || 'yes') === 'yes'

export function notfParse(obj: INotf | undefined, acctId: string, tlid: string | 'notf', popup: number, targetContent?: string) {
    if (!obj || !isDateType(dateType)) return {
        noticeAvatar: '',
        ifNotf: '',
        noticeText: ''
    }
    const domain = localStorage.getItem(`domain_${acctId}`)
    const account = notf.eventBy
    const type = notf.event
    const { createdAt, id } = notf
    let noticeavatar = gif ? account.avatar : account.avatar_static
    noticeavatar = `<a onclick="udg('${account.id}','${acctId}');" user="${account.acct}" class="udg">
                <img draggable="false" src="${noticeavatar}" width="20" class="notf-icon prof-img" user="${account.acct}" alt="" loading="lazy">
            </a>`
    let what = 'New event'
    let icon = 'fa-help grey-text'
    if (type === 'mention') {
        what = lang.lang_parse_mentioned
        icon = 'fa-share teal-text'
        noticeavatar = ''
    } else if (type === 'reblog') {
        what = lang.lang_parse_bted
        icon = 'fa-retweet light-blue-text'
    } else if (type === 'favourite') {
        what = lang.lang_parse_faved
        icon = 'fa-star  yellow-text'
    } else if (type === 'poll') {
        what = lang.lang_parse_polled
        icon = 'fa-tasks  purple-text'
    }

    let disName = escapeHTML(account.display_name || account.acct)
    //絵文字があれば
    if (account.emojis.length) disName = customEmojiReplace(disName, account, gif)
    const notfFilHide = tlid === 'notf' ? 'hide' : ''
    let noticetext = `<span onclick="notfFilter('${account.id}','${tlid}');" class=" pointer big-text ${notfFilHide}">
                <i class="fas fa-filter" title="${lang.lang_parse_notffilter}"></i>
                <span class="voice">${lang.lang_parse_notffilter}</span>
            </span>
            <span class="cbadge cbadge-hover" title="${date(createdAt, 'absolute')}(${lang.lang_parse_notftime})" aria-hidden="true">
                <i class="far fa-clock"></i>
                ${date(createdAt, dateType)}
            </span>
            <span class="voice">${date(createdAt, 'absolute')}(${lang.lang_parse_notftime})</span>
            <i class="big-text fas ${icon}"></i>
            <a onclick="udg('${account.id}','${acctId}')" class="pointer grey-text notf-udg-text">
                ${disName}(@${account.acct})
            </a>`
    const memory = localStorage.getItem('notice-mem')
    if (popup >= 0 && obj.length < 5 && noticetext !== memory) {
        let file = ''
        let sound = ''
        if (localStorage.getItem('hasNotfC_' + acctId) !== 'true') {
            if (type === 'mention') {
                const replyCt = parseInt(localStorage.getItem(`notf-reply_${acctId}`) || '0', 10)
                $(`.notf-reply_${acctId}`).text(replyCt + 1)
                $(`.notf-reply_${acctId}`).removeClass('hide')
                $(`.boxIn[data-acct=${acctId}] .notice-box`).addClass('has-notf')
                sound = localStorage.getItem('replySound') || 'default'
                if (sound === 'default') file = '../../source/notif3.wav'
            } else if (type === 'reblog') {
                const btCt = parseInt(localStorage.getItem(`notf-bt_${acctId}`) || '0', 10)
                $(`.notf-bt_${acctId}`).text(btCt + 1)
                $(`.notf-bt_${acctId}`).removeClass('hide')
                $(`.boxIn[data-acct=${acctId}] .notice-box`).addClass('has-notf')
                sound = localStorage.getItem('btSound') || 'default'
                if (sound === 'default') file = '../../source/notif2.wav'
            } else if (type === 'favourite') {
                const favCt = parseInt(localStorage.getItem(`notf-fav_${acctId}`) || '0', 10)
                $(`.notf-fav_${acctId}`).text(favCt + 1)
                $(`.notf-fav_${acctId}`).removeClass('hide')
                $(`.boxIn[data-acct=${acctId}] .notice-box`).addClass('has-notf')
                sound = localStorage.getItem('favSound') || 'default'
                if (sound === 'default') file = '../../source/notif.wav'
            }
        }
        if (popup > 0) {
            toast({
                html: '[' + domain + ']' + escapeHTML(account.display_name || '?') + what,
                displayLength: popup * 1000
            })
        }
        //通知音
        if (sound === 'c1') {
            file = localStorage.getItem('custom1') || '../../source/notif.wav'
        } else if (sound === 'c2') {
            file = localStorage.getItem('custom2') || '../../source/notif.wav'
        } else if (sound === 'c3') {
            file = localStorage.getItem('custom3') || '../../source/notif.wav'
        } else if (sound === 'c4') {
            file = localStorage.getItem('custom4') || '../../source/notif.wav'
        }
        if (file) {
            const request = new XMLHttpRequest()
            request.open('GET', file, true)
            request.responseType = 'arraybuffer'
            request.onload = () => playSound(request)
            request.send()
        }
        if (native) {
            const options = {
                body: `${account.display_name}(${account.acct})${what}\n\n${stripTags(targetContent || '')}`,
                icon: account.avatar
            }
            new Notification('TheDesk:' + domain, options)
        }
        if (localStorage.getItem('hasNotfC_' + acctId) !== 'true') {
            $('.notf-icon_' + acctId).addClass('red-text')
        }
        localStorage.setItem('notice-mem', noticetext)
        noticetext = ''
    }
    const ifNotf = `data-notfIndv="${acctId}_${id}" data-notf="${id}"`
    return {
        noticeAvatar: noticeavatar,
        ifNotf,
        noticeText: noticetext
    }
}