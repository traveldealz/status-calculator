const template = /*html*/ `
  <style>
  button[disabled] {
    background-color: gray;
  }
  .route-mode--expert.hidden,
  .route-mode--builder.hidden {
    display: none;
  }
  </style>
  <form>
    <label class="block font-semibold mb-1">__(Routings)</label>
    <label class="flex items-center gap-3 mb-2 text-sm">
      <input type="checkbox" class="form-switch" role="switch" id="toggle-expert-mode" />
      <span>__(Expert mode)</span>
    </label>
    <div class="route-mode route-mode--builder">
      <route-builder id="route-builder"></route-builder>
    </div>
    <div class="route-mode route-mode--expert hidden">
      <textarea id="route-textarea" class="w-full my-1" rows="4"></textarea>
      <small class="block text-xs text-gray">__(Manual input: carrier:class:AAA-BBB-CCC)</small>
    </div>
    <input type="hidden" name="route" value="" />
    <small></small>
    <p><small>__(See instructions on) <a href="__(https://travel-dealz.com/tools/miles-calculator)" target="_blank">__(mileage calculator)</a> </small> </p>
    <div class="my-3">
      <button class="mr-3 px-3 py-1 bg-brand hover:bg-gray-darker text-white" type="submit">__(Calculate)</button>
    </div>
  </form>
  <div class="loading hidden">__(Loading & calculating...)</div>
  <div class="error hidden"></div>
  <ul class="col-2" id="list"></ul>
  <p><small>__(Data provided by) <a href="https://wheretocredit.com" target="_blank">wheretocredit.com</a></small></p>
`;

export default template;
