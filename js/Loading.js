$(() => {
    let loading = $("#Loading");
    loading.addClass("Loaded");
    setTimeout(() => {
        loading.addClass("End");
    }, 1 * 1000);
});