/* =========================================================
   共通スクリプト
   1) スマートフォン用ナビゲーションの開閉
   2) お問い合わせ／エントリーフォームの入力チェック
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. モバイルナビ ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('gnav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    });

    // メニュー内のリンクを押したら閉じる
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'メニューを開く');
      }
    });

    // 画面幅がPCサイズに戻ったら状態をリセット
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. フォーム ---------- */
  var form = document.querySelector('form[data-validate]');
  if (!form) return;

  var status = form.querySelector('.form-status');

  function setError(field, message) {
    field.classList.add('is-error');
    var box = field.querySelector('.field-error');
    if (box) box.textContent = message;
  }

  function clearError(field) {
    field.classList.remove('is-error');
  }

  function validate() {
    var ok = true;
    var firstBad = null;

    // 必須項目
    form.querySelectorAll('.field').forEach(function (field) {
      var input = field.querySelector('input, select, textarea');
      if (!input || !input.required) return;

      clearError(field);
      var value = (input.value || '').trim();

      if (!value) {
        setError(field, '入力してください。');
        ok = false;
        if (!firstBad) firstBad = input;
        return;
      }
      if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError(field, 'メールアドレスの形式をご確認ください。');
        ok = false;
        if (!firstBad) firstBad = input;
        return;
      }
      if (input.type === 'tel' && !/^[0-9０-９\-ー()（） ]{9,}$/.test(value)) {
        setError(field, '電話番号の形式をご確認ください。');
        ok = false;
        if (!firstBad) firstBad = input;
      }
    });

    // 個人情報の取り扱いへの同意
    var consent = form.querySelector('input[type="checkbox"][required]');
    if (consent && !consent.checked) {
      window.alert('個人情報の取り扱いについてご同意ください。');
      ok = false;
      if (!firstBad) firstBad = consent;
    }

    if (firstBad) {
      firstBad.focus();
      firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
  }

  form.addEventListener('submit', function (e) {
    if (!validate()) {
      e.preventDefault();
      return;
    }

    // ▼ 送信先（action）が未設定の場合は送信せず案内を表示します。
    //   フォームの送信先が決まったら HTML の <form action="..."> を設定してください。
    var action = form.getAttribute('action');
    if (!action || action === '#') {
      e.preventDefault();
      if (status) {
        status.classList.add('is-shown', 'is-warn');
        status.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // 入力し直したらエラー表示を消す
  form.addEventListener('input', function (e) {
    var field = e.target.closest('.field');
    if (field) clearError(field);
  });
})();
