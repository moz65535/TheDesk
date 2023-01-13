global.selectedColumn = 0
global.selectedToot = 0
import $ from 'jquery'
import { makeNewList } from '../tl/list'
import { src, srcBox } from '../tl/src'

$(function ($) {
	//キーボードショートカット
	$(window).keydown(function (e) {
		const hasFocus = $('input').is(':focus')
		const hasFocus2 = $('textarea').is(':focus')
		let wv = false
		if (document.getElementById('webview')) {
			if (!$('#webviewsel:checked').val()) {
				wv = true
			}
		} else {
			wv = true
		}
		//Enter
		if (e.keyCode === 13) {
			if ($('#src').is(':focus')) {
				src()
				return false
			}
			if ($('#list-add').is(':focus')) {
				makeNewList()
				return false
			}
		}
		//Ctrl+Shift+Enter:Lgen
		if (e.metaKey || (e.ctrlKey && wv)) {
			if (e.shiftKey) {
				if (e.keyCode === 13) {
					post('local')
					return false
				}
			}
		}
		//Ctrl+Enter:投稿
		if (e.metaKey || (e.ctrlKey && wv)) {
			if (e.keyCode === 13) {
				post()
				return false
			}
		}
		//Alt+Enter:セカンダリー
		if (e.metaKey || (e.altKey && wv)) {
			if (e.keyCode === 13) {
				sec()
				return false
			}
		}
		//Esc:消す
		if (e.keyCode === 27 && wv) {
			hide()
			return false
		}
		//F5リロード
		if (e.keyCode === 116 && wv) {
			location.href = 'index.html'
			return false
		}
		//Ctrl+Sift+C:全消し
		if ((e.metaKey || e.ctrlKey) && e.shiftKey && wv) {
			if (e.keyCode === 67) {
				clear()
				return false
			}
		}
		//Ctrl+Sift+N:NowPlaying
		if ((e.metaKey || e.ctrlKey) && e.shiftKey && wv) {
			if (e.keyCode === 78) {
				show()
				nowplaying()
				return false
			}
		}
		//input/textareaにフォーカスなし時
		if (!hasFocus && !hasFocus2 && wv) {
			if (!wv) {
				return true
			}
			//Ctrl+V:いつもの
			if (e.metaKey || e.ctrlKey) {
				if (e.keyCode === 86) {
					show()
				}
			}
			//Ctrl+F:検索
			if (e.metaKey || e.ctrlKey) {
				if (e.keyCode === 70) {
					srcBox('toggle')
				}
			}
			//X:開閉
			if (e.keyCode === 88) {
				if (!$('#post-box').hasClass('appear')) {
					show()
					document.getElementById('textarea')?.focus()
				} else {
					hide()
				}
				return false
			}
			//N:新トゥート
			if (e.keyCode === 78) {
				if (!$('#post-box').hasClass('appear')) {
					show()
				}
				document.getElementById('textarea')?.focus()

				return false
			}
			//Ctrl+E:全ての通知未読を既読にする
			if (e.metaKey || e.ctrlKey) {
				if (e.keyCode === 69) {
					allNotfRead()
					return false
				}
			}
			//Ctrl+K:メニュー開閉
			if (e.metaKey || e.ctrlKey) {
				if (e.keyCode === 75) {
					menu()
					return false
				}
			}
			//Ctrl+Space:読み込み
			if (e.metaKey || e.ctrlKey) {
				if (e.keyCode === 32) {
					parseColumn()
					return false
				}
			}
			//Ctrl+Sift+S:設定
			if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
				if (e.keyCode === 83) {
					location.href = 'setting.html'
					return false
				}
			}
			//Ctrl+Sift+M:アカマネ
			if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
				if (e.keyCode === 77) {
					location.href = 'acct.html'
					return false
				}
			}
			//Ctrl+Sift+P:プロフ
			if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
				if (e.keyCode === 80) {
					profShow()
					return false
				}
			}
			//数字:TL
			if (e.metaKey || e.ctrlKey) {
				if (e.keyCode >= 49 && e.keyCode <= 57) {
					const kz = e.keyCode - 49
					goColumn(kz)
					return false
				}
			}
			//矢印:選択
			if (e.code === 'ArrowLeft') {
				//left
				if ($('#imagemodal').hasClass('open')) {
					imgCont('prev')
					return false
				}
				if (global.selectedColumn > 0) {
					global.selectedColumn--
				}
				tootSelector(global.selectedColumn, global.selectedToot)
				return false
			} else if (e.code === 'ArrowUp') {
				//up
				if ($('#imagemodal').hasClass('open')) {
					return false
				}
				if (global.selectedToot > 0) {
					global.selectedToot--
				}
				tootSelector(global.selectedColumn, global.selectedToot)
				return false
			} else if (e.code === 'ArrowRight') {
				//right
				if ($('#imagemodal').hasClass('open')) {
					imgCont('next')
					return false
				}
				if (global.selectedColumn < $('.tl-box').length - 1) {
					global.selectedColumn++
				}
				tootSelector(global.selectedColumn, global.selectedToot)
				return false
			} else if (e.code === 'ArrowDown') {
				//down
				if ($('#imagemodal').hasClass('open')) {
					return false
				}
				global.selectedToot++
				tootSelector(global.selectedColumn, global.selectedToot)
				return false
			}
			//Ctrl+U:0,0選択
			if (e.ctrlKey || e.metaKey) {
				if (e.keyCode === 85) {
					global.selectedToot = 0
					global.selectedColumn = 0
					tootSelector(0, 0)
					return false
				}
			}
			//選択時
			if (e.keyCode === 70) {
				const id = $('.global.selectedToot').attr('unique-id')
				const acct_id = $('#timeline_' + global.selectedColumn).attr('data-acct')
				fav(id, acct_id, false)
				return false
			}
			if (e.keyCode === 66) {
				const id = $('.global.selectedToot').attr('unique-id')
				const acct_id = $('#timeline_' + global.selectedColumn).attr('data-acct')
				rt(id, acct_id, false)
				return false
			}
			if (e.keyCode === 82) {
				const id = $('.global.selectedToot').attr('unique-id')
				const acct_id = $('#timeline_' + global.selectedColumn).attr('data-acct')
				const ats_cm = $('.global.selectedToot .rep-btn').attr('data-men')
				const mode = $('.global.selectedToot .rep-btn').attr('data-visen')
				const cwTxt = $('#cw-text').val()
				re(id, ats_cm, acct_id, mode, cwTxt)
				return false
			}
		}
		//textareaフォーカス時
		if (hasFocus2 && wv) {
			if (e.metaKey || e.ctrlKey) {
				//C+S+(No):ワンクリ
				if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
					if (e.keyCode >= 49 && e.keyCode <= 51) {
						const no = e.keyCode - 48
						if (localStorage.getItem('oks-' + no)) {
							const from = $('#textarea').val() || ''
							const add = localStorage.getItem('oks-' + no) || ''
							$('#textarea').val(from + add)
						}
						return false
					}
				}
			}
		}
	})
	//クリアボタン
	$('#clear').click(function () {
		clear()
	})
})
//選択する
function tootSelector(column, toot) {
	$('.cvo').removeClass('global.selectedToot')
	$('#timeline_' + column + ' .cvo')
		.eq(toot)
		.addClass('global.selectedToot')
	const scr = $('.tl-box[tlid=' + column + ']').scrollTop() || 0
	const elem = $('.global.selectedToot').offset()?.top || 0
	let top = elem - ($('.tl-box').height() || 0) + scr
	if (top > 0) {
		top = top + ($('.global.selectedToot').height() || 0)
		if (top > scr) {
			$('.tl-box[tlid=' + column + ']').animate({ scrollTop: top })
		}
	} else if (elem < 0) {
		const to = scr + elem - ($('.global.selectedToot').height() || 0)
		if (to < scr) {
			$('.tl-box[tlid=' + column + ']').animate({ scrollTop: to })
		}
	}
}