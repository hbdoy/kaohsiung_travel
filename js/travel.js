var travel = (function () {
    var allData;
    var data_order_by_zone = [];
    var zone_select = document.getElementById("zone_select");
    var zone_header = document.getElementById("zone_header");
    var result_cards = document.getElementById("result_cards");
    var hot = document.getElementById("hot");

    function _getData() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
        xhr.send(null);
        xhr.onload = function (data) {
            // console.log(xhr.status);
            if (xhr.status == 200) {
                // console.log(xhr.responseText);
                allData = JSON.parse(xhr.responseText);
                // console.log(allData.result.records);
                _renderSelect();
                _renderCards("all");
            } else {
                // console.log("伺服器發生錯誤");
                alert("伺服器發生錯誤，請稍後再試");
            }
        };
    }

    function _eventBind() {
        // 當表單更動時，將 user 選擇的區域傳入傳入函數重新渲染
        zone_select.addEventListener("change", function (e) {
            // console.log(this.value);
            _renderCards(this.value);
        });
        hot.addEventListener("click", function (e) {
            // console.log(e.target.nodeName);
            if (e.target.nodeName == "BUTTON") {
                // console.log(e.target.textContent);
                // user 點選熱門分類時，更新選單的值
                zone_select.value = e.target.textContent;
                _renderCards(e.target.textContent);
            }
        });
    }

    function _renderSelect() {
        // 此函數將所有資料中的區域找出來，並渲染到 form 中的 select
        // 另外也將每筆資料放進對應的區域陣列
        // 後續分頁或是切換區域就不用每次重新過濾出特定區域的資料
        var allZone = [];
        for (let item of allData.result.records) {
            // 找出資料中所有區域
            if (allZone.indexOf(item.Zone) == -1) {
                // 暫存記錄所有區域
                allZone.push(item.Zone);
                // 新建該區域的資料陣列
                data_order_by_zone[item.Zone] = [];
                var newOption = document.createElement("option");
                newOption.textContent = item.Zone;
                zone_select.appendChild(newOption);
            }
            // 將資料放進對應的區域
            data_order_by_zone[item.Zone].push(item);
        }
        // console.log(data_order_by_zone["前鎮區"]);
    }

    function _renderCards(zone) {
        // 依照傳進的區域來重新渲染畫面
        var renderData = [];
        if (zone == "all") {
            // 如果是全部區域就把原來的所有資料賦予給 renderData
            zone_header.textContent = "全部區域";
            renderData = allData.result.records;
        } else {
            // 其餘資料各依所屬區域賦予給 renderData
            zone_header.textContent = zone;
            renderData = data_order_by_zone[zone];
        }
        // console.log(renderData);

        // pagination讓我用第三方套件偷懶一下XD
        $('#myPagination').pagination({
            dataSource: renderData,
            pageSize: 8,
            autoHidePrevious: true,
            autoHideNext: true,
            ulClassName: 'pagination',
            callback: function (data, pagination) {
                // console.log(data);
                var str = "";
                for (let i = 0; i < data.length; i++) {
                    str += `
                    <div class="col-md-6 mb-4">
                        <div class="card" style="width: 100%;">
                            <div class="card-img-top" style="background-image: url(${data[i].Picture1});"></div>
                            <div class="card-body px-4">
                                <div class="d-flex card-title">
                                    <h4 class="mr-auto">${data[i].Name}</h4>
                                    <div class="card_zone_text">
                                        ${data[i].Zone}
                                    </div>
                                </div>
                                <div class="card-text">
                                    <div class="mb-2">
                                        <span class="openTime"></span>
                                        ${data[i].Opentime}
                                    </div>
                                    <div class="mb-2">
                                        <span class="location"></span>
                                        ${data[i].Add}
                                    </div>
                                    <div class="d-flex mb-2">
                                        <div class="mr-auto" style="display: inline-block">
                                            <span class="phone"></span>
                                            ${data[i].Tel}
                                        </div>
                                        <div style="display: inline-block">
                                            <span class="ticket"></span>
                                            ${data[i].Ticketinfo}
                                        </div>
                                    </div>
                                    <div class="mb-2">
                                        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#${data[i].Id}" aria-expanded="false">
                                            查看更多
                                        </button>
                                    </div>
                                    <div class="collapse" id="${data[i].Id}">
                                        <div class="card card-body">
                                            ${data[i].Description}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                }
                result_cards.innerHTML = str;
            }
        })
    }

    function init() {
        _getData();
        _eventBind();
        console.log("init");
    }

    return {
        init
    }
})();