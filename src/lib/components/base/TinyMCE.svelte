<script context="module">
    /*
     * ---------------------------------------------------------------
     * The below component is similar to https://github.com/tinymce/tinymce-svelte
     * but with removed unnecessary dependencies (eg. the TinyMCE cloud loading script)
     * and with extra error catching to handle the async edge-cases
     * when the init event is fired after the Svelte component was destroyed.
     * ---------------------------------------------------------------
     */

    function createScriptLoader() {
        let state = {
            listeners: [],
            scriptLoaded: false,
            injected: false,
        };

        function injectScript(doc, url, callback) {
            state.injected = true;
            const script = doc.createElement("script");
            script.referrerPolicy = "origin";
            script.type = "application/javascript";
            script.src = url;
            script.onload = () => {
                callback();
            };
            if (doc.head) {
                doc.head.appendChild(script);
            }
        }

        function load(doc, url, callback) {
            if (state.scriptLoaded) {
                callback();
            } else {
                state.listeners.push(callback);
                // check we can access doc
                if (!state.injected) {
                    injectScript(doc, url, () => {
                        state.listeners.forEach((fn) => fn());
                        state.scriptLoaded = true;
                    });
                }
            }
        }

        return { load };
    }

    let scriptLoader = createScriptLoader();
</script>

<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { page } from '$app/stores';
    import CommonHelper from "$lib/utils/CommonHelper";

    export let id = "tinymce_svelte" + CommonHelper.randomString(7);
    export let inline = undefined;
    export let disabled = false;
    export let scriptSrc = `${$page.url.origin}/libs/tinymce/tinymce.min.js`;
    export let conf = {};
    export let modelEvents = "change input undo redo";
    export let value = "";
    export let text = "";
    export let cssClass = "tinymce-wrapper";

    // Events
    // ---------------------------------------------------------------
    const validEvents = [
        "Activate",
        "AddUndo",
        "BeforeAddUndo",
        "BeforeExecCommand",
        "BeforeGetContent",
        "BeforeRenderUI",
        "BeforeSetContent",
        "BeforePaste",
        "Blur",
        "Change",
        "ClearUndos",
        "Click",
        "ContextMenu",
        "Copy",
        "Cut",
        "Dblclick",
        "Deactivate",
        "Dirty",
        "Drag",
        "DragDrop",
        "DragEnd",
        "DragGesture",
        "DragOver",
        "Drop",
        "ExecCommand",
        "Focus",
        "FocusIn",
        "FocusOut",
        "GetContent",
        "Hide",
        "Init",
        "KeyDown",
        "KeyPress",
        "KeyUp",
        "LoadContent",
        "MouseDown",
        "MouseEnter",
        "MouseLeave",
        "MouseMove",
        "MouseOut",
        "MouseOver",
        "MouseUp",
        "NodeChange",
        "ObjectResizeStart",
        "ObjectResized",
        "ObjectSelected",
        "Paste",
        "PostProcess",
        "PostRender",
        "PreProcess",
        "ProgressState",
        "Redo",
        "Remove",
        "Reset",
        "ResizeEditor",
        "SaveContent",
        "SelectionChange",
        "SetAttrib",
        "SetContent",
        "Show",
        "Submit",
        "Undo",
        "VisualAid",
    ];

    const bindHandlers = (editor, dispatch) => {
        validEvents.forEach((eventName) => {
            editor.on(eventName, (e) => {
                dispatch(eventName.toLowerCase(), {
                    eventName,
                    event: e,
                    editor,
                });
            });
        });
    };
    // ---------------------------------------------------------------

    let container;
    let element;
    let editorRef;

    let lastVal = value;
    let disablindCache = disabled;

    const dispatch = createEventDispatcher();

    $: {
        try {
            if (editorRef && lastVal !== value) {
                editorRef.setContent(value);
                text = editorRef.getContent({ format: "text" });
            }
            if (editorRef && disabled !== disablindCache) {
                disablindCache = disabled;
                if (typeof editorRef.mode?.set === "function") {
                    editorRef.mode.set(disabled ? "readonly" : "design");
                } else {
                    editorRef.setMode(disabled ? "readonly" : "design");
                }
            }
        } catch (err) {
            console.warn("TinyMCE reactive error:", err);
        }
    }

    function getTinymce() {
        return window && window.tinymce ? window.tinymce : null;
    }

    function init() {
        const finalInit = {
            ...conf,
            target: element,
            inline: inline !== undefined ? inline : conf.inline !== undefined ? conf.inline : false,
            readonly: disabled,
            setup: (editor) => {
                editorRef = editor;
                editor.on("init", () => {
                    editor.setContent(value);
                    // bind model events
                    editor.on(modelEvents, () => {
                        lastVal = editor.getContent();
                        if (lastVal !== value) {
                            value = lastVal;
                            text = editor.getContent({ format: "text" });
                        }
                    });
                });

                bindHandlers(editor, dispatch);

                if (typeof conf.setup === "function") {
                    conf.setup(editor);
                }
            },
        };

        element.style.visibility = "";

        getTinymce().init(finalInit);
    }

    onMount(() => {
        loadMarked();
        if (getTinymce() !== null) {
            init();
        } else {
            scriptLoader.load(container.ownerDocument, scriptSrc, () => {
                // init if the container is not removed from the DOM
                if (container) {
                    init();
                }
            });
        }

        return () => {
            try {
                if (editorRef) {
                    getTinymce()?.remove(editorRef);
                }
            } catch (_) {}
        };
    });







  let marked
  const loadMarked = () => {
    let script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/marked@12.0.2/lib/marked.umd.min.js";
    document.head.append(script);

    script.onload = () => {
      marked = window.marked.marked;
      console.log("marked loaded");
    };
  };

  
  let inputText = '';
  let isLoading = false; // Initialize with boolean value
  
  let completion = '';
  let apiKey = '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';
  

  const data = {
    "messages": [],
    "model": "llama3-8b-8192"
  };

  async function handleSubmit() {
    isLoading = true;
    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
    const obj = {"role": "user", "content": inputText}
    data.messages.push(obj)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log(result);
      const updates = (result.choices[0].message.content)
      const resObj = {"role": "assistant", "content": updates}
      data.messages.push(resObj)
      value = marked(updates);
      isLoading = false;
    } catch (error) {
      console.error(error);
      isLoading = false;
    }
  }
</script>




<div bind:this={container} class={cssClass}>
    {#if inline}
        <div {id} bind:this={element} />
    {:else}
      {#if disabled}
        <textarea {id} bind:this={element} style="visibility: hidden" />
      {:else}
        <div class="flex flex-col items-center md:justify-center min-w-full py-10 grow">
            <div class="z-50 rounded-full drop-shadow-sm bg-gray-100 border border-gray-200 -mt-5 dark:bg-gray-900 dark:border-gray-800 flex focus-within:border-blue-300 dark:focus:border-blue-700 transition-colors">
            <textarea {id} bind:this={element} style="visibility: hidden" />
              <input
                class="bg-transparent rounded-full py-1 px-4 focus:outline-none"
                placeholder="Prompt AI..."
                bind:value={inputText}
                aria-label="Prompt"
                required
              />
          
              <span
                aria-label="Submit"
                type="button"
                class="rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors text-white size-8 md:size-10 flex items-center justify-center"
                on:click={handleSubmit}
              >
                {#if isLoading}
                  <div class="ai-loader"></div>
                {:else}
                  &nbsp;&#x2728;&nbsp;
                {/if}
              </span>
            </div>
        </div>
      {/if}
    {/if}
</div>







<style>
  .ai-loader {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    /*width: 120px;
    height: 120px;*/
    animation: spin 0.1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

