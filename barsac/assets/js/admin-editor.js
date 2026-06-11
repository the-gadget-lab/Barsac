// Upgrades the post-body textarea into a Toast UI Editor: a visual (WYSIWYG)
// editor with a Markdown-mode toggle. The body is still stored as Markdown, so
// nothing downstream changes. If this script or the editor fails to load, the
// plain Markdown textarea remains fully usable (progressive enhancement).
(function () {
  var holder = document.getElementById("md-editor");
  var field = document.getElementById("body-field");
  if (!holder || !field || !window.toastui || !window.toastui.Editor) return;

  var form = field.form;

  // A hidden required field can't be focused for validation; let the server
  // enforce "body required" instead (it already re-renders with an error).
  field.removeAttribute("required");
  field.style.display = "none";

  var editor = new toastui.Editor({
    el: holder,
    height: "560px",
    initialEditType: "wysiwyg", // open in visual mode; users can switch to Markdown
    previewStyle: "vertical",
    initialValue: field.value || "",
    usageStatistics: false,
    language: "fr",
    hooks: {
      // Upload pasted/inserted images to the server and insert the returned URL
      // (our display sanitizer only allows http(s) image sources, not base64).
      addImageBlobHook: function (blob, callback) {
        var data = new FormData();
        data.append("image", blob);
        fetch("/admin/uploads", { method: "POST", body: data })
          .then(function (r) { return r.json(); })
          .then(function (d) {
            if (d && d.url) callback(d.url, blob.name || "");
            else alert("Échec du téléversement de l'image.");
          })
          .catch(function () { alert("Échec du téléversement de l'image."); });
      },
    },
  });

  // Sync the editor's Markdown back into the form field before submit.
  form.addEventListener("submit", function () {
    field.value = editor.getMarkdown();
  });
})();
