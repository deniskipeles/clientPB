<script lang="ts">
    import { dateTimeFormatter, getPbImageUrl, printFxn, urlToBase64 } from '$lib/utils';
    import { CloudArrowDown, PencilSquare, Printer } from 'svelte-heros-v2';
    import { page } from '$app/stores';
    import { afterNavigate } from '$app/navigation';
    import { onMount } from 'svelte';

    import {
        activeCollection,
        recordsStore,
        schemaHiddenColumnsStore
    } from '$lib/stores/collections';
    export let contenteditableFxn: Function;
    let data = { resultList: { items: $recordsStore }, table: $activeCollection };

    

    function getLocal() {
        let hiddenColumns: string[] = $schemaHiddenColumnsStore;
        try {
            const hiddenColumnsKey = $activeCollection?.id + '@hiddenColumns';
            const encoded = localStorage.getItem(hiddenColumnsKey);
            if (encoded) {
                hiddenColumns = JSON.parse(encoded) || [];
                schemaHiddenColumnsStore.set(hiddenColumns);
            }
        } catch (_) {}
        schema = $activeCollection?.schema?.filter(
            (i) => !$schemaHiddenColumnsStore?.includes(i?.id) && !$schemaHiddenColumnsStore?.includes(i?.name)
        );
        tableData=tableDataFxn()
    }
    
    $: if($schemaHiddenColumnsStore && fullyLoaded){
      getLocal()
    }

    export let collection = $activeCollection;
    export let contenteditable = false;
    export let fullyLoaded = false;

    let schema = collection?.schema;
    let printingPDF = false;

    import jsPDF from 'jspdf';
    import autoTable from 'jspdf-autotable';
    import tooltip from '$lib/actions/tooltip';
    import { addErrorToast } from '$lib/stores/toasts';
    import CommonHelper from '$lib/utils/CommonHelper';
    import AskAI from '$lib/components/base/AskAI.svelte';

    let loadingPDF = false;
    let imagesType: {
        row: number;
        col: number;
        imageLink: string;
        base64: string | null;
    }[] = [];
    $: images = imagesType;
    onMount(() => {
        fullyLoaded=true
        getLocal();
        getBase64();
    });
    afterNavigate(() => {
      if(fullyLoaded){
        getLocal()
        images = [];
        getBase64();
        contenteditable=false
      }
    });
    const getBase64 = () => {
        $recordsStore.forEach((item, row) => {
            schema?.forEach((schema_item, col) => {
                if (schema_item.type == 'file') {
                    let imageLink =
                        schema_item?.options?.maxSelect == 1
                            ? item[schema_item?.name]
                            : Array.isArray(item[schema_item?.name]) && item[schema_item?.name].length > 0
                            ? item[schema_item?.name][0]
                            : '';
                    urlToBase64(getPbImageUrl(item, imageLink, undefined) ?? '')
                        .then((base64) => {
                            images = [...images, { row, col, imageLink, base64 }];
                        })
                        .catch((e) => {
                            images = [...images, { row, col, imageLink, base64: null }];
                        });
                    setTimeout(() => {}, 200);
                }
            });
        });
    };

    let doc = new jsPDF();
    function downloadFxn(size:string) {
        if (size == 'short') {
            doc = new jsPDF()
        }
        loadingPDF = true;

        const table = schema?.map((i) => i?.name?.replaceAll('_', ' ')) ?? [];

        autoTable(doc, {
            head: [table],
            body: tableData,
            didDrawCell: (data) => {
                images?.forEach((image) => {
                    if (
                        data.section === 'body' &&
                        data.cell?.text[0]?.includes(image?.imageLink) &&
                        data.row.index === image.row &&
                        image.base64
                    ) {
                        var type = image.base64.split(';')[0]?.split('/')[1]?.toUpperCase();
                        if (type == 'JPG' || type == 'JPEG' || type == 'PNG') {
                            doc.addImage(image.base64, type, data.cell.x + 2, data.cell.y + 2, 10, 10);
                        }
                    }
                });
            }
        });
        try {
            doc.save(`table_${Date.now()}.pdf`);
            setTimeout(() => {}, 1000);
        } catch (error) {
            console.log(error);
        } finally {
            loadingPDF = false;
        }
    }
    let created=$schemaHiddenColumnsStore?.includes("created")
    let updated=$schemaHiddenColumnsStore?.includes("updated")
    let val= 0
    $:if(updated && created){
      val=2
    } else if(updated && !created){
      val=1
    } else if(!updated && created){
      val=1
    } else if(!updated && !created){
      val=0
    }

    $: filds = (Number(schema.length) - Number($schemaHiddenColumnsStore.length))-val;
    

    const tableDataFxn =()=> $recordsStore.map((item, row) => {
        return schema?.map((schema_item, col) => {
            if (schema_item.type == 'relation') {
                let table = data.table;
                table = $page.data.tables.find((i: any) => i.id == schema_item.options.collectionId);
                if (item.expand && item?.expand[schema_item?.name]) {
                    const present = table?.schema
                        .filter((i) => i.presentable == true && i.type != 'file')
                        ?.map((i) => i.name);
                    const expand = item?.expand[schema_item?.name];
                    if (Array.isArray(expand)) {
                        if (table?.type == 'auth') {
                            const users = expand?.map((i) =>
                                i?.name?.length > 0 ? i?.name : i?.username ?? 'no name'
                            );
                            return users.join('\n');
                        }
                        let mainArr = expand.map((expanded) => {
                            let arr: any = [];
                            present?.forEach((field) => {
                                arr.push(expanded[field]);
                            });
                            return arr.join(',');
                        });
                        return mainArr.join('\n');
                    } else {
                        if (table?.type == 'auth') {
                            return expand?.name?.length > 0 ? expand?.name : expand?.username ?? 'no name';
                        }
                        let arr: any = [];
                        present?.forEach((field) => {
                            arr.push(expand[field]);
                        });
                        return arr.join(',');
                    }
                }
            } else if (schema_item.type == 'file') {
                // return item[schema_item?.name] ?? '';
            } else if (schema_item.type == 'json' && typeof item[schema_item?.name] == 'object') {
                let json = item[schema_item?.name];
                if (schema_item?.name?.includes('answers') && Array.isArray(json)) {
                    const answers =
                        json?.map((ans: any) => {
                            if (ans?.correct) {
                                return `<<CORRECT>>\n${ans.answer}`;
                            }
                            return `:::INCORRECT:::\n${ans.answer}`;
                        }) ?? [];
                    return answers.join('\n');
                } else {
                    const stringifiedJson = CommonHelper.trimQuotedValue(JSON.stringify(json)) || '""'
                    return CommonHelper.truncate(stringifiedJson,50)
                }
            } else if (schema_item.type == 'date') {
                return dateTimeFormatter(item[schema_item?.name ?? '']);
            } else {
                return item[schema_item?.name ?? ''] ?? '';
            }
        }) ?? [];
    }) ?? [];
    
    let tableData=tableDataFxn()
    $: if(fullyLoaded&&schema?.length){
      tableData=tableDataFxn()
    }
    
</script>

<div class="page-header">
    <div class="flex gap-3 text-center dark:text-white">
        <AskAI context={{
          headerData:schema?.map((i) => i?.name?.replaceAll('_', ' ')) ?? [],
          bodyData:tableData,
          loadData:tableDataFxn()
        }}/>
        <button
            use:tooltip={`Click here to download pdf of the content you are viewing currently.(${filds} fields)`}
            class={`flex ${loadingPDF ? 'animate-ping' : ''}`}
            on:click={() => {
                getLocal();
                loadingPDF = true;
                if (filds <= 10) {
                    downloadFxn('short');
                } else {
                    addErrorToast('The table fields should be less than or equal to 10.');
                }
                setTimeout(() => {
                    loadingPDF = false;
                }, 2000);
            }}
        >
            <CloudArrowDown />{`download pdf`}
        </button>
        <button
            use:tooltip={`Click here to download or print what you see in this table in pdf format.`}
            class={`flex ${printingPDF ? 'animate-ping' : ''}`}
            on:click={() => {
                printFxn('printableThis');
            }}
        >
            <Printer />{'print'}
        </button>
    </div>
</div>
