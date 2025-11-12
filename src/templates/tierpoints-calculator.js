export default /*html*/ `
  <style>
  button[disabled] {
    background-color: gray;
  }
  .align-top {
    vertical-align: top;
  }
  .text-vertical {
    writing-mode: vertical-rl;
    text-orientation: sideways
  }
  .font-light {
    font-weight: 300;
  }
  .route-mode--expert.hidden,
  .route-mode--builder.hidden {
    display: none;
  }
  </style>
  <form>
    <label for="route">__(Routings)</label>
    <label class="flex items-center gap-3 mb-2 text-sm">
      <input type="checkbox" class="form-switch" role="switch" id="toggle-expert-mode" />
      <span>__(Expert mode)</span>
    </label>
    <div class="route-mode route-mode--builder">
      <route-builder id="route-builder" value="AF:L:FRA-AMS-FRA
AF:X:ATL-CDG-ATL"></route-builder>
    </div>
    <div class="route-mode route-mode--expert hidden">
      <textarea id="route-textarea" class="w-full my-1" rows="3">AF:L:FRA-AMS-FRA
AF:X:ATL-CDG-ATL</textarea>
      <small class="block text-xs text-gray">__(Manual input: carrier:class:AAA-BBB-CCC)</small>
    </div>
    <input type="hidden" name="route" value="AF:L:FRA-AMS-FRA
AF:X:ATL-CDG-ATL" />
    <small></small>
    <div class="my-3">
      <label for="program">__(Program)</label>
      <select id="program" name="program">
      </select>
      <label for="status">__(Current status)</label>
      <select id="status" name="status">
      </select>
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <table id="list" name="list"></table>
  <p><small>__(Data provided by) <a href="https://wheretocredit.com" target="_blank">wheretocredit.com</a></small></p>
`;
