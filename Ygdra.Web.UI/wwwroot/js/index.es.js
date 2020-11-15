// @ts-check 

class router {

    constructor() {
        this.map = new Map();
        this.currentQueryParameters = new Map();

        window.addEventListener('popstate', (pse) => this._onLocationChange(pse));

        this._init(location.href);

        // called every time the document is ready
        // event after an history callback whith popstate
        $(() => this._run());


    }
  
    /**
     * @returns {string} get the current view name (the /{View} name page)
     */
    getCurrentView() {
        return this.currentView;
    }

    /**
     * @returns {{[]}} get the query parameters
     */
    getQueryParameters() {
        return this.currentQueryParameters;
    }


    /**
     * @returns {URL} get the current url
     */
    getCurrentUrl() {
        return this.currentUrl;
    }

    /**
     * @returns {object} get the current state (usely after a post, and declared from the node view in {state} object)
     */
    getCurrentState() {
        return this.currentState;
    }


    /**
     * init the router on each url requested
     * @param {string} loc current location href
     */
    _init(loc) {
        //this.currentUrl = new urijs(loc);
        this.currentUrl = new URL(loc);

        // get the current view
        this.currentView = this.currentUrl.pathname;

        // set the query parameters
        this.currentUrl.searchParams.forEach((value, key) => {
            this.currentQueryParameters.set(key, value);
        });

    }


    /**
    * @param {PopStateEvent} popStateEvent 
    */
    _onLocationChange(popStateEvent) {
        var srcElem = popStateEvent.srcElement;

        // @ts-ignore
        if (!srcElem || !srcElem.location)
            return;

        if (this.currentPage && this.currentPage.onUnload)
            this.currentPage.onUnload();

        // @ts-ignore
        this._init(srcElem.location.href);
        this._run();
    }


    _createInstance(constructor) {
        var factory = constructor.bind.apply(constructor, arguments);
        return new factory();
    };


    /**
     * 
     * @param {string} url 
     * @param {object} [state] 
     */
    navigateTo(url, state) {

        if (url === this.currentUrl.pathname)
            return;

        window.history.pushState(state ? state : {}, "", url);
    }

    /**
    * @param {string} pathName : pathname uri
    * @param {object} pageHandler
    */
    register(pathName, pageHandler) {
        this.map.set(pathName, pageHandler);
    }

    _run() {

        if (!$)
            return;

        this.currentState = $("#routerState").val();

        if (this.currentState)
            this.currentState = JSON.parse(this.currentState);

        let currentKey;

        this.map.forEach((v, k) => {
            var r = new RegExp(k, 'i');
            let isMatch = r.test(this.currentView);
            if (isMatch)
                currentKey = k;
        });

        if (!currentKey)
            return;

        let currentPageCtor = this.map.get(currentKey);

        if (!currentPageCtor)
            return;

        this.currentPage = this._createInstance(currentPageCtor);

        if (!this.currentPage)
            return;

        if (this.currentPage.onLoad) {
            $(() => {
                this.currentPage.onLoad(this);
                console.log("router has loaded page " + this.currentView);
            });
        }

        if (this.currentPage.onUnload) {
            $(window).on('beforeunload', () => {
                this.currentPage.onUnload();
            });
        }

    }

}

// singleton
var router$1 = new router();

// @ts-check


class dashboardPage {


    constructor() {
    }

    async onLoad() {

    }


    /**
     * @param {number} pageIndex get the current page index
     */
    async refresh(pageIndex) {
    }

    onUnload() {
    }



}

// @ts-check

class enginesPage {


    constructor() {

    }

    async onLoad() {

    }


    onUnload() {
    }
}

// @ts-check

class modalPanel {

    /**
     * @param {string} id
     */
    constructor(id) {
        this.id = id;
        this._shownPanel = (e) => { };
        this._showPanel = (e) => { };
        this._unloadPanel = (e) => { };
        this._large = "";
        this._position = "right";
        this._center = "";

    }

    generate() {

        if (this.panel() && this.panel().length > 0)
            return this;

        let modalHtmlDiv = this._generateModalHtml();
        $('body').append(modalHtmlDiv);

        return this;
    }

    /** @returns modalPanel */
    sm() {
        this._large = "";
        return this;
    }


    /** @returns modalPanel */
    lg() {
        this._large = " modal-lg";
        return this;
    }

    /** @returns modalPanel */
    xl() {
        this._large = " modal-xl";
        this._position = "";
        return this;
    }


    /** @returns modalPanel */
    readonly() {
        this._data_readonly = 'data-backdrop="static" data-keyboard="false" ';
        return this;
    }

    center() {
        this._center = "modal-dialog-centered modal-dialog-scrollable";
        return this;
    }


    onShown(shownPanelEvent) { this.panel().on('shown.bs.modal', shownPanelEvent); }

    onShow(showPanelEvent) { this.panel().on('show.bs.modal', showPanelEvent); }

    onUnLoad(unloadPanelEvent) { this.panel().on('hide.bs.modal', unloadPanelEvent); }


    /** @returns {JQuery<HTMLElement>} */
    panel() { return $(`#${this.id}`) }

    /** @returns {JQuery<HTMLButtonElement>} */
    submitButton() { return $(`#${this.id}SubmitButton`) }

    /**  @returns {JQuery<HTMLButtonElement>} */
    deleteButton() {
        return $(`#${this.id}DeleteButton`)
    }

    deleteButtonText(text) {
        $(`#${this.id}DeleteButtonText`).text(text);
    }


    /** @returns {JQuery<HTMLButtonElement>}*/
    closeButton() { return $(`#${this.id}CloseButton`) }

    /** @returns {JQuery<HTMLDivElement>}*/
    // @ts-ignore
    body() { return $(`#${this.id}Body`) }

    /** @returns {JQuery<HTMLHRElement>}*/
    // @ts-ignore
    title() { return $(`#${this.id}Title`) }


    _generateModalHtml() {

        let modal = `
        <div class="modal ${this._position} fade" id="${this.id}" tabindex="-1" ${this._data_readonly}aria-labelledby="${this.id}" aria-hidden="true">
            <div class="modal-dialog${this._large} ${this._center}">
                <div class="modal-content${this._large}">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${this.id}Title"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="${this.id}Body">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark btn-sm" data-dismiss="modal" id="${this.id}CloseButton">
                            <i class="fas fa-undo"></i>
                            Close
                        </button>
                        <button type="button" class="btn btn-primary btn-sm" id="${this.id}SubmitButton">
                            <i class="fas fa-save"></i>
                            Submit
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" id="${this.id}DeleteButton">
                            <i class="fas fa-trash-alt"></i>
                            <span id="${this.id}DeleteButtonText">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        return modal;
    }

}

class console2 {

    /**
     * @param {JQuery<HTMLDivElement>} element
     * @param {JQuery<HTMLDivElement>} parentOverflowElement
     **/
    constructor(element, parentOverflowElement = null) {

        this._console2 = element;
        this._parentOverflowElement = parentOverflowElement;

        if (this._parentOverflowElement)
            this._initialTop = this._parentOverflowElement.position().top;

        // @ts-ignore
        window.Prism = window.Prism || {};
        // @ts-ignore
        window.Prism.manual = true;

        this._mgtlogin = document.getElementById('mgtlogin');

    }

    _userName() {

        let userName = "";

        if (this._mgtlogin && this._mgtlogin.userDetails) {

            let mail = this._mgtlogin.userDetails.email;
            if (!mail)
                mail = this._mgtlogin.userDetails.userPrincipalName;

            let nameMatch = mail.match(/^([^@]*)@/);
            userName = nameMatch ? nameMatch[1] : "";
        }

        return userName;
    }

    _scrollToEnd() {
        if (!this._parentOverflowElement)
            return;

        let height = this._console2.height();
        var newPos = this._initialTop + height;

        this._parentOverflowElement.scrollTo(newPos, 100);


    }

    clear() {
        this._console2.empty();
    }

    appendObject(jsonObject) {

        // @ts-ignore
        let jsonString = Prism.highlight(JSON.stringify(jsonObject, null, 2), Prism.languages.json, 'json');

        let str = "<pre class='ml-3 mr-3 mt-3' style='background-color:white;white-space:pre-wrap;width:90%;max-height:250px;'><code>";
        str += jsonString;
        str += "</code></pre>";

        this._console2.append(str);
        this._scrollToEnd();

    }



    appendWarning(line) {

        let str = `<div class="d-flex flex-row">`;
        str += `<span class="text-warning">${this._userName()}</span>`;
        str += `<span class="text-white">:</span>`;
        str += `<span class="text-warning">~$&nbsp;</span>`;
        str += `<span class="text-white">${line}</span>`;
        str += '</div>';

        this._console2.append(str);
        this._scrollToEnd();

    }

    appendError(line) {

        let str = `<div class="d-flex flex-row">`;
        str += `<span class="text-danger">${this._userName()}</span>`;
        str += `<span class="text-white">:</span>`;
        str += `<span class="text-danger">~$&nbsp;</span>`;
        str += `<span class="text-white">${line}</span>`;
        str += '</div>';

        this._console2.append(str);
        this._scrollToEnd();

    }

    log(line) { this.appendLine(line); }
    info(line) { this.appendLine(line); }
    error(line) { this.appendError(line); }
    warn(line) { this.appendWarning(line); }


    appendLine(line) {

        
        let str = `<div class="d-flex flex-row">`;
        str += `<span class="text-success">${this._userName()}</span>`;
        str += `<span class="text-white">:</span>`;
        str += `<span class="text-success">~$&nbsp;</span>`;
        str += `<span class="text-white">${line}</span>`;
        str += '</div>';

        this._console2.append(str);
        this._scrollToEnd();
    }


}

// @ts-check

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//export function enable() {
//    this.removeClass('disabled');
//    this.prop('disabled', false);
//}
//export function disable() {
//    this.addClass('disabled');
//    this.prop('disabled', true);

//}

///**
// * @param {string} data_url
// * @param {JQuery<HTMLElement>} element
// */
//export function loadPartialAsync(data_url, element) {
//    return new Promise((resolve, reject) => {
//        element.load(data_url, (response, status, xhr) => {
//            if (status == "error") {
//                reject(response);
//            }
//            resolve(response);
//        });
//    });
//}

// @ts-check

class handlers {

    constructor() {
        this.methods = {};
    }

    /**
     * 
     * @param {string} methodName
     * @param {Function} newMethod
     */
    on(methodName, newMethod) {
        if (!methodName || !newMethod) {
            return;
        }

        methodName = methodName.toLowerCase();

        // if there is no handlers already, create an empty array
        if (!this.methods[methodName]) {
            this.methods[methodName] = [];
        }

        // Preventing adding the same handler multiple times.
        if (this.methods[methodName].indexOf(newMethod) !== -1) {
            return;
        }

        // add the method to the handler list
        this.methods[methodName].push(newMethod);
    }


    /**
     * Unregister an handler
     * @param {string} methodName method name
     * @param {any} method (...args: any[]) => void
     */
    off(methodName, method) {
        if (!methodName) {
            return;
        }

        methodName = methodName.toLowerCase();

        // get all handlers with this method name
        const handlers = this.methods[methodName];

        // if handlers do not exists, return
        if (!handlers) {
            return;
        }

        // if we have a function existing
        if (method) {

            // get the index in all handlers
            const removeIdx = handlers.indexOf(method);

            // if we found it, make a splice in the handlers list
            if (removeIdx !== -1) {
                handlers.splice(removeIdx, 1);

                // if no more handlers, delete
                if (handlers.length === 0) {
                    delete this.methods[methodName];
                }
            }
        } else {
            delete this.methods[methodName];
        }

    }

    /**
     * @param {string} target   
     */
    invoke(target, ...parameters) {

        var _this = this;

        // get the methods array to invoke
        const methods = this.methods[target.toLowerCase()];

        // if we have at least on method in the methods array to invoke
        if (methods) {

            try {
                for (let m of methods) {
                    m.apply(_this, parameters);
                }
            } catch (e) {
                console.log(`A callback for the method ${target.toLowerCase()} threw error '${e}'.`);
            }

        } else {
            console.log(`No client method with the name '${target.toLowerCase()}' found.`);
        }
    }
}

/// <reference path="../wwwroot/lib/signalr/dist/browser/signalr.js" />

// @ts-check

class notification {

    // singleton
    static _current;

    /** @returns {notification} */
    static get current() {
        if (!notification._current)
            notification._current = new notification();

        return notification._current;
    }



    // events
    static OnStarted = "OnStarted";
    static OnStopped = "OnStopped";
    static OnConnected = "OnConnected";
    static OnConnecting = "OnConnecting";


    constructor() {
        this._handlers = new handlers();
        this._isConnected = false;
        this._isStarting = false;

        this.connection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.None)
            .withUrl('/notifications')
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Trace)
            .build();

        this.connection.onreconnecting(error => this._console.log(error));
        this.connection.onclose(error => this.onConnectionError(error));

        this.connection.on("connected", (_) => {
            this._isConnected = true;
            this._handlers.invoke(notification.OnConnected);
        });

    }

    async start() {
        let retryCount = 0;

        if (this._isStarting)
            return;

        this._isStarting = true;

        while (!this._isConnected && retryCount < 5) {

            retryCount++;

            if (this._isConnected) {
                break;
            }

            if (this.connection.state == signalR.HubConnectionState.Disconnected) {
                this._handlers.invoke(notification.OnConnecting);
                await this.connection.start();
            }

            await delay(1500);

            if (this._isConnected) {
                break;
            }
        }

        if (!this._isConnected || retryCount >= 5) {
            this._isStarting = false;
            throw new Error("Too many tries to connect");
        }

        this._handlers.invoke(notification.OnStarted);

    }

    async stop() {

        if (this.connection.state != signalR.HubConnectionState.Disconnected) {
            await this.connection.stop();
            this._handlers.invoke(notification.OnStopped);
        }

        this._isConnected = false;
        this._isStarting = false;

    }

    /**
     * @param {string} method
     * @param {Function} handler
     */
    on(method, handler) {
        if (method == notification.OnConnected ||
            method == notification.OnConnecting ||
            method == notification.OnStarted ||
            method == notification.OnStopped) {

            this._handlers.on(method, handler);

        } else {

            this.connection.on(method, handler);
        }

    }

    /**
     * @param {string} method
     * @param {Function} handler
     */
    off(method, handler) {
        if (method == notification.OnConnected ||
            method == notification.OnConnecting ||
            method == notification.OnStarted ||
            method == notification.OnStopped) {

            this._handlers.off(method, handler);

        } else {

            this.connection.off(method, handler);
        }

    }
    onConnectionError(error) {
        if (error && error.message) {
            this._console.error(error.message);
        }
    }


}

// @ts-check


class modalPanelDeleteEngine {



    static initialize(modal_data_target) {
        return new modalPanelDeleteEngine(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalEngine = new modalPanel(modal_data_target).lg().generate();

        this.modalEngine.onShown(e => this.shownPanel(e));
        this.modalEngine.onUnLoad(e => this.unloadPanel(e));
        this.modalEngine.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalEngine;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.modalEngine.deleteButton().click(async (event) => { await this.deleteEngineAsync(event); });
        this.modalEngine.submitButton().hide();
        this.modalEngine.deleteButton().hide();

        let titleString = button.data('title');

        this.modalEngine.body().empty();
        this.modalEngine.title().text(titleString);
        this.modalEngine.body().append("<div>&nbsp;</div>");
        this.modalEngine.body().append("<div class='console'></div>");

        /** @type JQuery<HTMLDivElement> */
        // @ts-ignore
        this.deleteConsoleElement = this.modalEngine.body().find('.console');
        this.deleteConsole = new console2(this.deleteConsoleElement, this.modalEngine.body());

        // subscribe to event from signalr about deployment
        notification.current.on("deploy", this.appendDeployToConsole.bind(this));

        notification.current.on(notification.OnStarted, async () => await this.deleteConsole.appendLine("Backend server started."));
        notification.current.on(notification.OnConnecting, async () => await this.deleteConsole.appendLine("Backend server connecting..."));
        notification.current.on(notification.OnConnected, async () => await this.deleteConsole.appendLine("Backend server connected..."));
        notification.current.on(notification.OnStopped, async () => await this.deleteConsole.appendLine("Backend server stopped."));


    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

        // Get the engine request id, and set it globaly
        this.engineId = button.data('engine-id');

        let engineRequestResponse = await fetch(`/api/engines/${this.engineId}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (engineRequestResponse.status >= 400) {
            $(location).attr('href', '/Admin/Index');
            return;
        }

        let engineRequest = await engineRequestResponse.json();

        // timeout of the page for some reason ?
        if (!engineRequest) {
            $(location).attr('href', '/');
            return;
        }

        this.modalEngine.deleteButton().show();

        $("<div class='m-2'>Are you sure you want to delete engine <b>" + engineRequest.engineName + "</b> ?</div>").insertBefore(this.deleteConsoleElement);

        this.deleteConsole.appendLine("Ready to delete. Please press 'Delete' button to start.");
    }

    /** @param {JQuery.ClickEvent<HTMLButtonElement, null, HTMLButtonElement, HTMLButtonElement>} evt */
    async deleteEngineAsync(evt) {

        evt.preventDefault();

        if (!this.engineId) {
            this.deleteConsole.appendError("Unable to retrieve the engine request id....");
            return;
        }

        // Get notification helper
        await notification.current.start();

        // subscribe to this deployment (for this user)
        await notification.current.connection.invoke('SubscribeDeploymentAsync', this.engineId);

        this.deleteConsole.appendLine("Waiting for an agent to enqueue the engine drop operation...");

        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        let urlDeletion = `/api/engines/${this.engineId}`;

        let response = await fetch(urlDeletion, { method: 'DELETE' });

        if (this._isInterrupted)
            return;

        if (response.status >= 400) {
            this.deleteConsole.appendError(`Unable to delete the engine request with Id ${this.engineId} `);
            return;
        }

        let dropEngineStart = await response.json();

        await this.appendDeployToConsole(dropEngineStart);

    }


    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.deleteConsole.appendError(deploy.message);
                break;
            case "Droping":
                this.deleteConsole.appendLine(deploy.message);
                break;
            case "Dropped":
                this.deleteConsole.appendLine(deploy.message);
                break;
            default:
                this.deleteConsole.appendWarning(deploy.message);
        }

        if (value)
            this.deleteConsole.appendObject(value);
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalEngine.body().empty();
    }


}

// @ts-check

class modalPanelResourceGroup {



    static initialize(modal_data_target) {
        return new modalPanelResourceGroup(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalEngine = new modalPanel(modal_data_target).lg().generate();

        this.modalEngine.onShown(e => this.shownPanel(e));
        this.modalEngine.onUnLoad(e => this.unloadPanel(e));
        this.modalEngine.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalEngine;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        // remove unecessary buttons
        this.modalEngine.submitButton().hide();
        this.modalEngine.deleteButton().hide();

        let titleString = button.data('title');

        this.modalEngine.body().empty();
        this.modalEngine.title().text(titleString);
        this.modalEngine.body().append("<div>&nbsp;</div>");
        this.modalEngine.body().append("<div class='console'></div>");

        /** @type JQuery<HTMLDivElement> */
        // @ts-ignore
        this.consoleElement = this.modalEngine.body().find('.console');
        this.console = new console2(this.consoleElement, this.modalEngine.body());

    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.console.appendLine(`Getting information...`);

        // Get the engine request id, and set it globaly
        this.engineId = button.data('engine-id');

        let engineResponse = await fetch(`/api/engines/${this.engineId}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (engineResponse.status >= 400) {
            this.console.appendError("Can't get engine details");
            return;
        }

        let engine = await engineResponse.json();

        // timeout of the page for some reason ?
        if (!engine) {
            this.console.appendError("Can't get engine details");
            return;
        }

        this.console.appendLine(`Resource group <strong>${engine.resourceGroupName}</strong> ...`);

        let rgResponse = await fetch(`/api/resourcegroups/${engine.resourceGroupName}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (rgResponse.status >= 400) {
            this.console.appendError("Can't get resource group details");
            return;
        }

        let resourceGroup = await rgResponse.json();

        this.console.appendObject(resourceGroup);

        let rgLinkResponse = await fetch(`/api/resourcegroups/${engine.resourceGroupName}/link`, {
            method: 'POST',
            body: JSON.stringify({ id: resourceGroup.id }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (rgLinkResponse.status >= 400) {
            this.console.appendError("Can't get resource group link.");
            return;
        }
        let resourceGroupLink = await rgLinkResponse.json();

        this.console.appendLine(`Azure resource group link : <a href=${resourceGroupLink.uri} target="_blank">${resourceGroup.name}</a>`);

        this.console.appendLine(`Done.`);


    }



    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console.appendError(deploy.message);
                break;
            case "Droping":
                this.console.appendLine(deploy.message);
                break;
            case "Dropped":
                this.console.appendLine(deploy.message);
                break;
            default:
                this.console.appendWarning(deploy.message);
        }

        if (value)
            this.console.appendObject(value);
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalEngine.body().empty();
    }


}

// @ts-check

class modalPanelDatabricks {



    static initialize(modal_data_target) {
        return new modalPanelDatabricks(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalEngine = new modalPanel(modal_data_target).lg().generate();

        this.modalEngine.onShown(e => this.shownPanel(e));
        this.modalEngine.onUnLoad(e => this.unloadPanel(e));
        this.modalEngine.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalEngine;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        // remove unecessary buttons
        this.modalEngine.submitButton().hide();
        this.modalEngine.deleteButton().hide();

        let titleString = button.data('title');

        this.modalEngine.body().empty();
        this.modalEngine.title().text(titleString);
        this.modalEngine.body().append("<div>&nbsp;</div>");
        this.modalEngine.body().append("<div class='console'></div>");

        /** @type JQuery<HTMLDivElement> */
        // @ts-ignore
        this.consoleElement = this.modalEngine.body().find('.console');
        this.console = new console2(this.consoleElement, this.modalEngine.body());

    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.console.appendLine(`Getting information...`);

        // Get the engine request id, and set it globaly
        this.engineId = button.data('engine-id');

        let engineResponse = await fetch(`/api/engines/${this.engineId}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (engineResponse.status >= 400) {
            this.console.appendError("Can't get engine details");
            return;
        }

        let engine = await engineResponse.json();

        // timeout of the page for some reason ?
        if (!engine) {
            this.console.appendError("Can't get engine details");
            return;
        }

        this.console.appendLine(`Resource group: <strong>${engine.resourceGroupName}</strong>.`);
        this.console.appendLine(`Databricks workspace: <strong>${engine.clusterName}</strong>.`);
        this.console.appendLine(`Getting information from Azure...`);

        let resourceResponse = await fetch(`/api/databricks/${engine.id}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (resourceResponse.status >= 400) {
            this.console.appendError("Can't get databricks details");
            return;
        }

        let resource = await resourceResponse.json();

        this.console.appendObject(resource);

        let resourceLinkResponse = await fetch(`/api/resourcegroups/${engine.resourceGroupName}/link`, {
            method: 'POST',
            body: JSON.stringify({ id: resource.id }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (resourceLinkResponse.status >= 400) {
            this.console.appendError("Can't get resource link.");
            return;
        }
        let resourceLink = await resourceLinkResponse.json();

        this.console.appendLine(`Azure Databriks workspace link: <a href="${resourceLink.uri}" target="_blank">${resource.name}</a>`);

        this.console.appendLine(`Databricks workspace link: <a href="https://${resource.properties.workspaceUrl}" target="_blank">${resource.name}</a>`);

        this.console.appendLine(`Getting information from Databricks...`);

        resourceResponse = await fetch(`/api/databricks/${engine.id}/cluster`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (resourceResponse.status >= 400) {
            this.console.appendError("Can't get databricks details");
            return;
        }

        resource = await resourceResponse.json();

        this.console.appendObject(resource);


        this.console.appendLine(`Done.`);


    }



    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console.appendError(deploy.message);
                break;
            case "Droping":
                this.console.appendLine(deploy.message);
                break;
            case "Dropped":
                this.console.appendLine(deploy.message);
                break;
            default:
                this.console.appendWarning(deploy.message);
        }

        if (value)
            this.console.appendObject(value);
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalEngine.body().empty();
    }


}

// @ts-check

class modalPanelDataFactory {



    static initialize(modal_data_target) {
        return new modalPanelDataFactory(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalEngine = new modalPanel(modal_data_target).lg().generate();

        this.modalEngine.onShown(e => this.shownPanel(e));
        this.modalEngine.onUnLoad(e => this.unloadPanel(e));
        this.modalEngine.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalEngine;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        // remove unecessary buttons
        this.modalEngine.submitButton().hide();
        this.modalEngine.deleteButton().hide();

        let titleString = button.data('title');

        this.modalEngine.body().empty();
        this.modalEngine.title().text(titleString);
        this.modalEngine.body().append("<div>&nbsp;</div>");
        this.modalEngine.body().append("<div class='console'></div>");

        /** @type JQuery<HTMLDivElement> */
        // @ts-ignore
        this.consoleElement = this.modalEngine.body().find('.console');
        this.console = new console2(this.consoleElement, this.modalEngine.body());

    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.console.appendLine(`Getting information...`);

        // Get the engine request id, and set it globaly
        this.engineId = button.data('engine-id');

        let engineResponse = await fetch(`/api/engines/${this.engineId}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (engineResponse.status >= 400) {
            this.console.appendError("Can't get engine details");
            return;
        }

        let engine = await engineResponse.json();

        // timeout of the page for some reason ?
        if (!engine) {
            this.console.appendError("Can't get engine details");
            return;
        }

        this.console.appendLine(`Resource group <strong>${engine.resourceGroupName}</strong> ...`);
        this.console.appendLine(`Data factory V2: <strong>${engine.factoryName}</strong>.`);
        this.console.appendLine(`Getting information from Azure...`);

        let resourceResponse = await fetch(`/api/datafactories/${engine.id}`);

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (resourceResponse.status >= 400) {
            this.console.appendError("Can't get data factory details");
            return;
        }

        let resource = await resourceResponse.json();

        this.console.appendObject(resource);

        let resourceLinkResponse = await fetch(`/api/resourcegroups/${engine.resourceGroupName}/link`, {
            method: 'POST',
            body: JSON.stringify({ id: resource.id }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (this._isInterrupted)
            return;

        // if any error to retrieve data, go back home page
        if (resourceLinkResponse.status >= 400) {
            this.console.appendError("Can't get resource group link.");
            return;
        }
        let resourceLink = await resourceLinkResponse.json();

        this.console.appendLine(`Azure resource group link : <a href=${resourceLink.uri} target="_blank">${resource.name}</a>`);

        this.console.appendLine(`Done.`);


    }



    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console.appendError(deploy.message);
                break;
            case "Droping":
                this.console.appendLine(deploy.message);
                break;
            case "Dropped":
                this.console.appendLine(deploy.message);
                break;
            default:
                this.console.appendWarning(deploy.message);
        }

        if (value)
            this.console.appendObject(value);
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalEngine.body().empty();
    }


}

// @ts-check


class modalPanelPreview {


    static initialize(modal_data_target) {
        return new modalPanelPreview(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        this.modalPreview = new modalPanel(modal_data_target).xl().center().generate();

        this.modalPreview.onShown(e => this.shownPanel(e));
        this.modalPreview.onUnLoad(e => this.unloadPanel(e));
        this.modalPreview.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalPreview;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.modalPreview.submitButton().hide();
        this.modalPreview.deleteButton().hide();

        let titleString = button.data('title');

        this.modalPreview.body().empty();
        this.modalPreview.title().text(titleString);
        this.modalPreview.body().text('Loading ...');
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        var button = $(event.relatedTarget); // Button that triggered the modal

        // Extract info from data-* attributes
        var engineId = button.data('engine-id');
        var dataSourceName = button.data('data-source-name');
        var schemaName = button.data('schema-name');
        var tableName = button.data('table-name');

        try {

            let previewRowsResponse = await fetch(`/api/AzureSqlDatabase/${engineId}/${dataSourceName}/tables/${schemaName}/${tableName}/preview`);

            if (previewRowsResponse.status != 400) {
                let previewRows = await previewRowsResponse.json();

                if (previewRows.length) {

                    this.modalPreview.body().empty();
                    this.modalPreview.body().append("<table id='table'></table>");

                    var row1 = previewRows[0];

                    var columns = [];
                    for (var o in row1) {
                        columns.push({
                            field: o,
                            title: o
                        });
                    }

                    $('#table').bootstrapTable({
                        columns: columns,
                        data: previewRows
                    });


                } else {
                    this.modalPreview.body().text('No rows...');
                }
            }
        } catch (e) {
            new modalPanelError("errorPreview", e).show();

        }

    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalPreview.body().empty();
    }


}

// @ts-check


class modalPanelUsers {


    static initialize(modal_data_target) {
        return new modalPanelUsers(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalUsers = new modalPanel(modal_data_target).sm().generate();

        this.modalUsers.onShown(e => this.shownPanel(e));
        this.modalUsers.onUnLoad(e => this.unloadPanel(e));
        this.modalUsers.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalUsers;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.modalUsers.submitButton().hide();
        this.modalUsers.deleteButton().hide();

        let titleString = button.data('title');

        this.modalUsers.body().empty();
        this.modalUsers.title().text(titleString);
        this.modalUsers.body().text('Loading ...');
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        var button = $(event.relatedTarget); // Button that triggered the modal
        var usersIdsVal = button.data('users-id'); // Extract info from data-* attributes

        if (!usersIdsVal || usersIdsVal === '') {
            this.modalUsers.body().text('Nothing to show.');
            return;
        }

        let usersIds = usersIdsVal.split(',').map(v => v.trim());

        for (var i = 0; i < usersIds.length; i++) {
            if (i === 0)
                this.modalUsers.body().empty();

            let userId = usersIds[i];

            if (!userId || userId == '')
                continue;

            this.modalUsers.body().append(
                "<div class='m-3' style='overflow:auto;'><mgt-person user-id='" + usersIds[i] + "' fetch-image='true' person-card='hover' view='twoLines'></mgt-person></div>"
            );

            if (this._isInterrupted)
                return;
        }
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalUsers.body().empty();
    }


}

// @ts-check


class modalPanelError$1 {


    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target, errorMessage) {

        this.modal_data_target = modal_data_target;
        this.errorMessage = errorMessage;
        this.modalError = new modalPanel(modal_data_target).xl().center().generate();

        this.modalError.onShown(e => this.shownPanel(e));
        this.modalError.onUnLoad(e => this.unloadPanel(e));
        this.modalError.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalError;
    }

    show() {
        this.modalError.panel().modal('show');
    }

    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget); // Button that triggered the modal

        this.modalError.submitButton().hide();
        this.modalError.deleteButton().hide();

        this.modalError.body().empty();
        this.modalError.title().text("Error");
        this.modalError.body().text(this.errorMessage);
    }

    async shownPanel(event) {

        var button = $(event.relatedTarget); // Button that triggered the modal
    }

    unloadPanel(event) {
        this.modalError.body().empty();
    }


}

// @ts-check

class engineDetailsPage {


    constructor() {

    }

    async onLoad() {
        modalPanelUsers.initialize("panelDeploymentOwners");
        modalPanelUsers.initialize("panelDeploymentMembers");
        modalPanelUsers.initialize("panelRequestOwners");
        modalPanelUsers.initialize("panelRequestMembers");

        modalPanelDeleteEngine.initialize("panelDeleteEngine");
        modalPanelResourceGroup.initialize("panelResourceGroup");
        modalPanelDatabricks.initialize("panelDatabricks");
        modalPanelDataFactory.initialize("panelDataFactory");

        this.id = $("#Id");

        if ($("#console").length) {
            this.console2 = new console2($("#console"), $('div.docking-form'));

            notification.current.on(notification.OnStarted, async () => {
                await notification.current.connection.invoke('SubscribeDeploymentAsync', this.id.val());
            });

            notification.current.on("deploy", this.appendDeployToConsole.bind(this));
        }


    }

    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console2.appendError(deploy.message);
                break;
            case "Deployed":
                this.console2.appendLine(deploy.message);
                break;
            case "Deploying":
                this.console2.appendLine(deploy.message);
                break;
            default:
                this.console2.appendWarning(deploy.message);
        }

        if (value)
            this.console2.appendObject(value);
    }


    onUnload() {
        notification.current.off("deploy", this.appendDeployToConsole.bind(this));

    }



}

class dotmimtable {

    static initialize() {

    }

    constructor(name, url, urlCount, pageSize) {

        this.name = name;
        this.url = url;
        this.urlCount = urlCount ?? this.url + "/count";

        this.spinner = $('#spinner-' + name);
        this.body = $('#tbody-' + name);
        this.previous = $('#previous-' + name);
        this.next = $('#next-' + name);
        this.refresh = $('#refresh-' + name);

        // disable buttons
        this.previous.parent().addClass('disabled');
        this.next.parent().addClass('disabled');

        // get a page
        this.pageIndex = 0;
        this.itemsCount = 0;
        this.pageSize = pageSize ?? 2;

        this.refresh.click((evt) => {
            evt.preventDefault();
            this.run();
        });

        this.previous.click((evt) => {
            evt.preventDefault();
            this.pageIndex = this.pageIndex - 1;
            this.load();
        });

        this.next.click((evt) => {
            evt.preventDefault();
            this.pageIndex = this.pageIndex + 1;
            this.load();
        });
    }

    async load() {
        let url = this.url + '?pageIndex=' + this.pageIndex + '&count=' + this.pageSize;

        this.spinner.show();
        //let d = await $.getJSON(url);

        this.body.load(url, (d, status, xhr) => {

            if (status == "error") {
                console.log(status);
            }

            if (!d || d.trim() == '')
                this.clearRows('No data');

            this.spinner.hide();
            this.enableDisableButtons();
        });

    }

    run() {
        this.spinner.show();
        this.clearRows();

        $.getJSON(this.urlCount, data => {
            this.itemsCount = data.count;
            this.load();
        }).fail((error) => {

            let errorString = error.responseJSON ? (error.responseJSON.error ?? error.responseJSON) : error.responseText;

            this.addFirstRowWarning(errorString);
            this.spinner.hide();
            this.enableDisableButtons();
        });
    }

    addFirstRowWarning(text) {
        this.body.children('tr').addClass('bg-danger');
        this.body.children('tr').children('td').addClass('text-light').append(text);
    }

    clearRows(text) {
        let columnsCount = this.body.parent().find('th').length;
        if (!columnsCount)
            columnsCount = this.body.parent().find('tr').length;
        if (!columnsCount)
            columnsCount = 1;

        text = text ?? '&nbsp;';

        this.body.html('<tr><td colspan=' + columnsCount + '>' + text + '</td></tr>');
    }


    enableDisableButtons() {

        if (this.pageIndex <= 0)
            this.previous.parent().addClass('disabled');
        else
            this.previous.parent().removeClass('disabled');

        if ((this.pageIndex + 1) * this.pageSize >= this.itemsCount)
            this.next.parent().addClass('disabled');
        else
            this.next.parent().removeClass('disabled');

    }
}

// @ts-check

class adminPage {


    constructor() {

    }

    async onLoad() {
    }

    onUnload() {
    }

}

// @ts-check

class adminDeploymentEnginePage {


    constructor() {

    }

    async onLoad() {

        modalPanelUsers.initialize("panelDeploymentOwners");
        modalPanelUsers.initialize("panelDeploymentMembers");
        modalPanelUsers.initialize("panelRequestOwners");
        modalPanelUsers.initialize("panelRequestMembers");

        this.id = $("#EngineView_Id");
        this.console2 = new console2($("#console"), $('div.docking-form'));
        this.launchButton = $('#launch');
        this.launchButton.prop('disabled', true);

        if (!this.id || !this.id.val()) {
            this.console2.appendWarning("Can't launch deployment. No engine request ...");
            return;
        }

        // subscribe to event from signalr about deployment
        notification.current.on("deploy", this.appendDeployToConsole.bind(this));

        notification.current.on(notification.OnStarted, async () => {
            await notification.current.connection.invoke('SubscribeDeploymentAsync', this.id.val());
            this.console2.appendLine("Backend server started.");
            this.console2.appendLine("Ready to deploy.");
            this.console2.appendLine("-----------------------");
            this.launchButton.prop('disabled', false);
        });

        notification.current.on(notification.OnConnecting, async () => await this.console2.appendLine("Backend server connecting..."));
        notification.current.on(notification.OnConnected, async () => await this.console2.appendLine("Backend server connected..."));
        notification.current.on(notification.OnStopped, async () => await this.console2.appendLine("Backend server stopped."));

        // Just in case it's not started (but should be done already from homePage.js)
        await notification.current.start();

        this.launchButton.click(async (evt) => {
            evt.preventDefault();

            // Launch a validation before
            let isValid = $("form").valid();

            if (!isValid)
                return;

            await this.launchJobAsync();
        });

    }



    async launchJobAsync() {
        this.console2.clear();

        this.console2.appendLine("Deployment started.");
        this.console2.appendLine("-----------------------");

        if (!this.id || !this.id.val()) {
            this.console2.appendWarning("Can't launch deployment. No engine request ...");
            return;
        }

        this.console2.appendLine("Saving deployment properties...");

        try {
            // First, save the deployment.
            await $.post('', $('form').serialize());

        } catch (e) {
            this.console2.appendError(`Unable to save engine details`);
            this.console2.appendObject(e.responseJSON);
            return;
        }

        try {
            this.console2.appendLine("Waiting for an agent to enqueue the deployment...");

            // url for that particular deployment
            let url = `/api/engines/${this.id.val()}/deploy`;

            var response = await fetch(url, { method: 'POST' });

            if (response.status >= 400) {
                this.console2.appendError(`<b>Deployment</b> ${this.id.val()} can not be deployed...`);
                var errorJson = await response.json();
                await this.console2.appendObject(errorJson);
                return;
            }

            let deploymentstart = await response.json();

            await this.appendDeployToConsole(deploymentstart);

        } catch (e) {
            this.console2.appendError(`Unable to deploy engine`);
            this.console2.appendObject(e.responseJSON);
        }
    }

    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console2.appendError(deploy.message);
                break;
            case "Deployed":
                this.console2.appendLine(deploy.message);
                break;
            case "Deploying":
                this.console2.appendLine(deploy.message);
                break;
            default:
                this.console2.appendWarning(deploy.message);
        }

        if (value)
            this.console2.appendObject(value);
    }

    async onUnload() {
        notification.current.off("deploy", this.appendDeployToConsole.bind(this));
    }


}

// @ts-check

class adminEngineRequestDetailsPage {


    constructor() {

    }

    async onLoad() {
        modalPanelUsers.initialize("panelDeploymentOwners");
        modalPanelUsers.initialize("panelDeploymentMembers");
        modalPanelUsers.initialize("panelRequestOwners");
        modalPanelUsers.initialize("panelRequestMembers");

        modalPanelDeleteEngine.initialize("panelDeleteEngine");
        modalPanelResourceGroup.initialize("panelResourceGroup");
        modalPanelDatabricks.initialize("panelDatabricks");
        modalPanelDataFactory.initialize("panelDataFactory");

        this.id = $("#Id");

        if ($("#console").length) {
            this.console2 = new console2($("#console"), $('div.docking-form'));

            notification.current.on(notification.OnStarted, async () => {
                await notification.current.connection.invoke('SubscribeDeploymentAsync', this.id.val());
            });

            notification.current.on("deploy", this.appendDeployToConsole.bind(this));
        }
    }

    async appendDeployToConsole(deploy, value) {

        if (!deploy)
            return;

        switch (deploy.state) {
            case "Error":
                this.console2.appendError(deploy.message);
                break;
            case "Deployed":
                this.console2.appendLine(deploy.message);
                break;
            case "Deploying":
                this.console2.appendLine(deploy.message);
                break;
            default:
                this.console2.appendWarning(deploy.message);
        }

        if (value)
            this.console2.appendObject(value);
    }


    onUnload() {
        notification.current.off("deploy", this.appendDeployToConsole.bind(this));

    }

}

class mgtloader {


    static setMgtProvider() {
        const provider = new mgt.ProxyProvider("/api/Proxy");
        provider.login = () => window.location.href = '/Account/SignIn?redirectUri=' + window.location.href;
        provider.logout = () => window.location.href = '/MicrosoftIdentity/Account/SignOut';

        mgt.Providers.globalProvider = provider;
    }

    static interceptMgtLogin() {
        var mgtlogin = document.getElementById('mgtlogin');

        //// Theses events are raised when user click on login our logout button
        //// Theyr are not raised at the good timing
        //// Should be renamed 'loginClick' and 'logoutClick'
        //mgtlogin.addEventListener('loginCompleted', () => localStorage.removeItem("userdetails"));
        //mgtlogin.addEventListener('logoutCompleted', () => localStorage.removeItem("userdetails"));

        //// get local storage item if any
        //var userDetailsFromStorageString = localStorage.getItem('userdetails');

        //if (userDetailsFromStorageString !== null && mgtlogin.userDetails === null)
        //    mgtlogin.userDetails = JSON.parse(userDetailsFromStorageString);

        //// Loading completed is correctly fired AFTER component is loaded AND user logged in
        //mgtlogin.addEventListener('loadingCompleted', () => {
        //    if (mgtlogin.userDetails !== null)
        //        localStorage.setItem('userdetails', JSON.stringify(mgtlogin.userDetails));
        //});

    }
}

// @ts-check

class auth {


	// singleton
	static _current;

	/** @returns {auth} */
	static get current() {
		if (!auth._current)
			auth._current = new auth();

		return auth._current;
	}

	static OnAuthenticated = "OnAuthenticated"

	constructor() {
		this.handlers = new handlers();

		/** @type boolean */
		this.isAuthenticated = globalUserAuthenticated;
	}

	initialize() {

		$(() => {
			// invoke all handlers to OnAuthenticated with the correct value
			this.handlers.invoke(auth.OnAuthenticated, this.isAuthenticated, 'cool');
		});
	}

	on(methodName, newMethod) {
		this.handlers.on(methodName, newMethod);
	}

	off(methodName, method) {
		this.handlers.off(methodName, method);
	}

}

// @ts-check

class homePage {

    // singleton
    static _current;

    /** @returns {homePage} */
    static get current() {
        if (!homePage._current)
            homePage._current = new homePage();

        return homePage._current;
    }


    initialize() {
        $(async () => await this.onLoad());
    }

    async onLoad() {

        // Get the notification modal
        this.notifModal = new modalPanel("notif").sm().generate();

        // auto bind with arrow function
        this.notifModal.onShown(e => this.shownPanel(e));
        this.notifModal.onUnLoad(e => this.unloadPanel(e));
        // manual binding for fun
        this.notifModal.onShow(this.showPanel.bind(this));

        this.settingsModal = new modalPanel("settings").lg().generate();

        this.settingsModal.onShown(e => this.shownSettingsPanel(e));
        this.settingsModal.onUnLoad(e => this.unloadSettingsPanel(e));


        //notification.current.on(notification.OnStarted, async () => await console.log("Backend server started."));
        //notification.current.on(notification.OnConnecting, async () => await console.log("Backend server connecting..."));
        //notification.current.on(notification.OnConnected, async () => await console.log("Backend server connected..."));
        //notification.current.on(notification.OnStopped, async () => await console.log("Backend server stopped."));

        // when receiving an order to refresh notifications
        notification.current.on('refresh_notifications', async () => {
            console.log("call to refresh_notifications");
            await this.refreshNotificationsAsync();
        });

        notification.current.start();


        if (auth.current.isAuthenticated) {
            this.settingsModal.body().append(`
                <ul class="settings">
                  <li>
                    <label>
                        <i class="fas fa-th-large"></i>
                        About   
                    </label>
                    <div>Something interesting like... Hey, this is a piece of OSS project, made by Sebastien Pertus</div>
                  </li>
                  <li>
                    <label>
                        <i class="fas fa-cogs"></i>
                        Default Engine   
                    </label>  
                    <select class="mt-2" data-style="btn-outline-dark" data-container="body" data-live-search="true" title="Choose default engine" id="defaultEngineSelect">
                        <option>Mustard</option>
                        <option>Ketchup</option>
                        <option>Relish</option>
                    </select>
                  </li>
                </ul>
            `);

            $('#defaultEngineSelect').selectpicker();

        }
    }


    constructor() {

 

        auth.current.on(auth.OnAuthenticated, async isAuth => {
            if (isAuth)
                await this.refreshNotificationsAsync();
        });

    }

    async dismissNotificationsAsync() {

        // loading notifications
        let url = "/api/notifications";
        let response = await fetch(url, { method: "DELETE" });

        var deleted = response.json();

        if (!deleted)
            return;

        this.notifModal.body().empty();

        await this.refreshNotificationsAsync();
    }

    async refreshNotificationsAsync() {

        // loading notifications
        let url = "/api/notifications";
        let response = await fetch(url);

        if (response.status >= 400) {
            return;
        }

        this.notifications = await response.json();

        this.notifModal.body().empty();

        let bellContent = $('#notif-bell-content');

        if (!this.notifications || this.notifications.length <= 0) {

            bellContent.hide();


            this.notifModal.body().append(`
                    <div class="notif-empty">
                        <div class="notif-empty-body">
                            <i class="far fa-bell"></i>
                        </div>
                        <div class="notif-empty-message">
                            <span>No new notifications, yet.</span>
                        </div>
                    </div>`);

        } else {

            bellContent.show();
            bellContent.text(this.notifications.length.toString());

            for (let notif of this.notifications) {

                let notifUrl = '';
                if (notif.url)
                    notifUrl = `<a href="${notif.url}" class="ml-2 hide-sm"><i class="fas fa-external-link-alt"></i></a>`;

                this.notifModal.body().append(`
                    <div class="notif">
                        <div class="notif-title">
                            <i class="fas fa-check-circle"></i>
                            <span>${notif.title}</span>
                        </div>
                        <div class="notif-message">
                            <span>${notif.message}</span>
                            ${notifUrl}
                        </div >
                    </div > `);
            }
        }

    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var type = button.data('type');

    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    shownSettingsPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

        let titleString = button.data('title');

        this.settingsModal.submitButton().hide();
        this.settingsModal.title().text(titleString);
        this.settingsModal.deleteButton().hide();
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadSettingsPanel(event) {
    }


    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {

        let button = $(event.relatedTarget); // Button that triggered the modal

        let titleString = button.data('title');

        this.notifModal.submitButton().hide();
        this.notifModal.title().text(titleString);
        this.notifModal.deleteButtonText("Dismiss notifications");

        if (!auth.current.isAuthenticated) {
            this.notifModal.body().append(`
                    < div class= "notif-empty" >
                    <div class="notif-empty-body">
                        <i class="far fa-bell"></i>
                    </div>
                    <div class="notif-empty-message">
                        <span>Please log in to see notifications here.</span>
                    </div>
                    </div > `);
        }

        this.notifModal.deleteButton().click(async (evt) => {
            evt.preventDefault();
            await this.dismissNotificationsAsync();
        });


    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
    }


    onUnload() {
    }



}

// @ts-check

class settingsPage {


    constructor() {

    }

    async onLoad() {
    }


    onUnload() {
    }



}

function setEngineBootstrapTable($enginesTable, url, checked, onPostBody, onCheckRow) {


    let onCheck = checked ? onCheckRow : () => { };
    let onClick = checked ? () => { }: onCheckRow;

    let columns = [];
    if (checked)
        columns.push({
            field: 'engineId',
            radio: true,
        });

    columns.push({
        field: 'engineTypeJson',
        title: 'Type',
        width: '80',
        align: 'center',
        searchFormatter: false,
        sortable: true,
        formatter: (value, row) => {
            return `<div class='svg-22x22-icon'><div class='svg-icon ${value.engineTypeIconString}'></div></div>`;
        }
    }, {
        field: 'statusJson',
        title: 'Status',
        width: '80',
        align: 'center',
        searchFormatter: false,
        sortable: true,
        formatter: (value, row) => {
            return `<i class="${value.statusIcon}" title='${value.statusString}' style="color:${value.statusColor};width:20px;"></i>`;
        }

    }, {
        field: 'engineName',
        title: 'Name',
        sortable: true,
        formatter: (value, row) => {
            return `<strong>${value}</strong>`;
        }
    });

    $enginesTable.bootstrapTable({
        url: url,
        search: false,
        showRefresh: false,
        showToggle: false,
        checkboxHeader: false,
        clickToSelect: true,
        pagination: false,
        resizable: true,
        loadingTemplate: () => {
            return '<i class="fa fa-spinner fa-spin fa-fw fa-2x"></i>';
        },
        columns: columns,
        onPostBody: onPostBody,
        onCheck: onCheck,
        onClickRow: onClick,
        formatNoMatches: () => { return "You don't have any running engine. Please <a href='/Engines/Index'>check your engines status.</a> "; }
    });

}

// @ts-check

class dataSourcesPage {

    constructor() {

    }

    async onLoad() {

        // get table
        this.enginesTable = $("#enginesTable");

        // get engine table
        this.$enginesTable = $("#enginesTable");

        setEngineBootstrapTable(this.$enginesTable, "/dataSources/index/engines", true,
            (data) => this.onPostBody(data),
            (row) => this.onClickRow(row));

        this.dataSourcesTable = $("#dataSourcesTable");
        this.dataSourcesTable.bootstrapTable({
            formatNoMatches: () => { return 'Please select a running engine to see all data sources available.'; }
        });

        this.dataSourcesTable.on('click-row.bs.table', (row, $element, field) => {
            window.location.href = `/DataSources/Edit/${this.engine.id}/${$element.name}`;
        });
    }

    async onPostBody(data) {
        if (data && data.length > 0) {

            this.engine = data[0];
            this.$enginesTable.bootstrapTable('check', 0);
        }
    }

    async onClickRow(row) {

        this.engine = row;
        await this.loadDataSourcesAsync(this.engine);
    }


    async loadDataSourcesAsync(engine) {

        this.dataSourcesTable.bootstrapTable('showLoading');
        let data_url = `/dataSources/index/dataSources?engineId=${engine.id}`;
        let dataSourcesResponse = await fetch(data_url);
        this.dataSources = await dataSourcesResponse.json();

        if (!this.dataSources)
            this.dataSources = [];

        this.dataSourcesTable.bootstrapTable('updateFormatText', 'formatNoMatches',
            `No data sources for engine <strong>${engine.engineName}</strong>. <a href='/dataSources/new'>Create a new data source</a> for your engine`);

        this.dataSourcesTable.bootstrapTable('load', this.dataSources);

        this.dataSourcesTable.bootstrapTable('hideLoading');

    }

    async onUnLoad() {

    }
}

// @ts-check

class wizardPage {

    constructor(htmlFieldPrefix, engineUrl) {

        // HtmlFieldPrefix prefix is the predix for rendering asp.net core items
        this.htmlFieldPrefix = `${htmlFieldPrefix}_`;

        // url for loading engines
        this.engineUrl = engineUrl;
    }

    async onLoad() {
        // get form
        this.$form = $("form");

        // get engine table
        this.$enginesTable = $("#enginesTable");

        // get spinner
        this.$spinner = $("#spinner");

        // get buttons
        this.$nextButton = $("#nextButton");
        this.$previousButton = $("#previousButton");
        this.$saveButton = $("#saveButton");

        // get wizard
        this.$smartWizard = $("#smartWizard");

        // get properties panel
        this.$properties = $("#properties");

        // hidden fields
        this.$engineIdElement = $(`#${this.htmlFieldPrefix}EngineId`);
        this.$isNew = $(`#${this.htmlFieldPrefix}IsNew`);

        // No prefix for hiddent Step field, since it's directly binded into the PageModel
        this.$step = $(`#Step`);

        this.step = this.$step  && this.$step.val() ? parseInt(this.$step.val()) : 0;

        if (this.$spinner)
            this.$spinner.hide();

        this.boostrapEnginesTable();

        this.bootstrapWizard();

        this.bootstrapButtons();
    }


    bootstrapWizard() {

        // Step show event
        this.$smartWizard.on("showStep", async (e, anchorObject, stepNumber, stepDirection, stepPosition) => {

            // Update step
            this.$step.val(stepNumber);

            this.$nextButton.enable();
            this.$previousButton.enable();
            this.$nextButton.enable();
            this.$saveButton.disable();

            if (stepPosition === "first") {
                this.$previousButton.disable();
            } else if (stepPosition === "middle") {
                this.$previousButton.enable();
                this.$nextButton.enable();
            } else if (stepPosition === "last") {
                this.$nextButton.disable();
                this.$saveButton.enable();
            }

        });


        // bootstrap wizard
        this.$smartWizard.smartWizard({
            selected: this.step,
            theme: 'dots', // theme for the wizard, related css need to include for other than default theme
            autoAdjustHeight: false,
            transition: {
                animation: 'fade', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                speed: '200', // Transion animation speed
                easing: '' // Transition animation easing. Not supported without a jQuery easing plugin
            },
            enableURLhash: false,
            toolbarSettings: {
                toolbarPosition: 'none', // none, top, bottom, both
                toolbarButtonPosition: 'right', // left, right, center
                showNextButton: false, // show/hide a Next button
                showPreviousButton: false, // show/hide a Previous button
                toolbarExtraButtons: [] // Extra buttons to show on toolbar, array of jQuery input/buttons elements
            },
            keyboardSettings: {
                keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            },
        });

    }


    async engineTableOnCheckRow(row, $element) {
        if (this.$engineIdElement)
            this.$engineIdElement.val(row.id);

    }
    async engineTableOnPostBody(data) {

        if (!data?.length) {
            this.$nextButton.disable();
            return;
        }

        if (this.$engineIdElement && this.$engineIdElement.val()) {

            let selectedIndex = data.findIndex(e => e.id === this.$engineIdElement.val());

            if (selectedIndex >= 0)
                this.$enginesTable.bootstrapTable('check', selectedIndex);
        }

        // get the radio inputs buttons to add a validation rule on them
        let $btSelectItem = $('input[name="btSelectItem"]');

        $btSelectItem.rules("add", {
            required: true,
            messages: {
                required: "You should select an engine before going next step.",
            }
        });

    }

    boostrapEnginesTable() {

        if (!this.$enginesTable || !this.engineUrl)
            return;

        setEngineBootstrapTable(this.$enginesTable, this.engineUrl, true,
            (data) => this.engineTableOnPostBody(data),
            (row, $element) => this.engineTableOnCheckRow(row, $element));

    }

    bootstrapButtons() {

        if (this.$previousButton) {
            this.$previousButton.click((evt) => {
                evt.preventDefault();
                this.$smartWizard.smartWizard("prev");
                return true;
            });
        }

        if (this.$nextButton) {
            this.$nextButton.click((evt) => {
                evt.preventDefault();

                if (!this.validateForm())
                    return false;

                this.$smartWizard.smartWizard("next");
                return true;
            });
        }
    }


    validateForm() {

        if (!this.$form)
            return true;

        let isValid = this.$form.valid();

        if (!isValid)
            return false;

        let validator = this.$form.validate();
        validator.resetForm();

        let summary = this.$form.find(".validation-summary-errors");

        if (summary) {
            let list = summary.find("ul");
            if (list)
                list.empty();
        }

        return true;
    }

}

// @ts-check
class dataSourceAzureSql {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureSqlDatabase`);

        // Getting test button
        this.$dataSourceTestButton = $("#dataSourceTestButton");

        if (this.$dataSourceTestButton.length) {

            this.$dataSourceTestButton.click(async (evt) => {

                evt.preventDefault();

                let engineId = $("#DataSourceView_EngineId").val();

                if (engineId)
                    await this.$dataSourceTestButton.testAsync(`/api/datafactories/${engineId}/test`);
            });
        }

    }

}

class dataSourceAzureDataLakeV2 {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureBlobFS`);


        // Getting test button
        this.$dataSourceTestButton = $("#dataSourceTestButton");

        if (this.$dataSourceTestButton.length) {

            this.$dataSourceTestButton.click(async (evt) => {

                evt.preventDefault();

                let engineId = $("#DataSourceView_EngineId").val();

                if (engineId)
                    await this.$dataSourceTestButton.testAsync(`/api/datafactories/${engineId}/test`);
            });
        }

    }

}

class dataSourceAzureCosmosDb {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=CosmosDb`);


        // Getting test button
        this.$dataSourceTestButton = $("#dataSourceTestButton");

        if (this.$dataSourceTestButton.length) {

            this.$dataSourceTestButton.click(async (evt) => {

                evt.preventDefault();

                let engineId = $("#DataSourceView_EngineId").val();

                if (engineId)
                    await this.$dataSourceTestButton.testAsync(`/api/datafactories/${engineId}/test`);
            });
        }

    }
}

class dataSourceAzureBlobStorage {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureBlobStorage`);


        // Getting test button
        this.$dataSourceTestButton = $("#dataSourceTestButton");

        if (this.$dataSourceTestButton.length) {

            this.$dataSourceTestButton.click(async (evt) => {

                evt.preventDefault();

                let engineId = $("#DataSourceView_EngineId").val();

                if (engineId)
                    await this.$dataSourceTestButton.testAsync(`/api/datafactories/${engineId}/test`);
            });
        }

    }

}

// @ts-check

class dataSourceNew extends wizardPage {

    constructor() {
        super('DataSourceView', '/dataSources/new/engines');

        this.dataSourceAzureSql = new dataSourceAzureSql();
        this.dataSourceAzureDataLakeV2 = new dataSourceAzureDataLakeV2();
        this.dataSourceAzureCosmosDb = new dataSourceAzureCosmosDb();
        this.dataSourceAzureBlobStorage = new dataSourceAzureBlobStorage();
        this.lastTypeSelected = '';

    }

    async onLoad() {
        // call base onLoad method
        super.onLoad();


        this.$smartWizard.on("stepContent", async (e, anchorObject, stepNumber, stepDirection) => {
            if (stepNumber == 2) {

                this.$spinner?.show();

                try {

                    if (this.$engineIdElement) {
                        let engineId = this.$engineIdElement.val().toString();

                        if (!engineId?.length) {
                            this.$smartWizard.smartWizard("goToStep", 1);
                            return;
                        }
                        // get selection from data sources type
                        let type = $(`input[name="DataSourceView.DataSourceType"]:checked`).val();

                        if (!type) {
                            this.$smartWizard.smartWizard("goToStep", 1);
                            return;
                        }

                        if (this.lastTypeSelected === type.toString())
                            return;

                        this.lastTypeSelected = type.toString();

                        if (type.toString().toLowerCase() == 'azuresqldatabase')
                            await this.dataSourceAzureSql.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                        if (type.toString().toLowerCase() == 'azuresqldw')
                            await this.dataSourceAzureSql.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                        if (type.toString().toLowerCase() == 'azureblobfs')
                            await this.dataSourceAzureDataLakeV2.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                        if (type.toString().toLowerCase() == 'azureblobstorage')
                            await this.dataSourceAzureBlobStorage.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                        if (type.toString().toLowerCase() == 'cosmosdb')
                            await this.dataSourceAzureCosmosDb.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                    }

                } catch (e) {

                    this.$smartWizard.smartWizard("goToStep", 0);
                }

                this.$spinner?.hide();

            }
        });
    }






    //async testConnectionAsync(evt) {

    //    evt.preventDefault();

    //    this.lblTestConnection.text("");
    //    this.lblTestConnection.removeClass();

    //    this.btnTestConnection.disable();

    //    // url for that particular deployment
    //    let url = `/api/dataSources/sqlconnection/test`;

    //    let response = await fetch(url, {
    //        method: 'POST',
    //        body: JSON.stringify({ connection: this.connectionString.val() }),
    //        headers: {
    //            "Content-type": "application/json; charset=UTF-8"
    //        }
    //    });

    //    if (response.status >= 400) {
    //        var errorJson = await response.json()
    //        await this.lblTestConnection.text(errorJson.error)
    //    }

    //    var result = await response.json();

    //    if (result.result) {
    //        this.lblTestConnection.addClass("text-success ml-2");
    //        this.lblTestConnection.html("<i class='fas fa-check-circle'></i>  Connection successful");
    //    }
    //    else {
    //        this.lblTestConnection.addClass("text-danger ml-2");
    //        this.lblTestConnection.html("<i class='fas fa-exclamation-circle'></i>  Can't connect to the source using this connection string");
    //    }

    //    this.btnTestConnection.enable();
    //}
}

// @ts-check

class dataSourceEdit {

    constructor() {
    }

    async onLoad() {

        this.engineId = $("#DataSourceView_EngineId").val();

        this.$dataSourceTestButton = $("#dataSourceTestButton");

        if (this.$dataSourceTestButton.length) {

            this.$dataSourceTestButton.click(async (evt) => {
                evt.preventDefault();

                if (this.engineId)
                    await this.$dataSourceTestButton.testAsync(`/api/datafactories/${this.engineId}/test`);
            });
        }

        this.$sourceCode = $("#sourceCode");

        let jsonObjectString = $("#DataSourceView_JsonString").val();

        if (jsonObjectString && jsonObjectString.length) {

            var o = JSON.parse(jsonObjectString);
            let jsonString = Prism.highlight(JSON.stringify(o, null, 2), Prism.languages.json, 'json');

            let $sourceCode = $("#sourceCode");

            if ($sourceCode)
                $sourceCode.html(jsonString);

        }

    }




}

// @ts-check

class entitiesPage {

    constructor() {

    }

    async onPostBody(data) {
        if (data && data.length > 0) {
            this.engine = data[0];
            this.$enginesTable.bootstrapTable('check', 0);
        }
    }

    async onClickRow(row) {
        this.engine = row;
        await this.loadEntitiesAsync(this.engine);
    }


    async onLoad() {

        // get table
        this.$enginesTable = $("#enginesTable");

        if (!this.$enginesTable)
            return;

        setEngineBootstrapTable(this.$enginesTable, '/entities/index/engines', true,
            (data) => this.onPostBody(data),
            (row) => this.onClickRow(row));

        this.$entitiesTable = $("#entitiesTable");

        this.$entitiesTable.bootstrapTable({
            formatNoMatches: () => { return 'Please select a running engine to see all the entities.'; }
        });

        this.$entitiesTable.on('click-row.bs.table', (row, $element, field) => {
            window.location.href = `/Entities/Edit/${this.engine.id}/${$element.name}`;
        });
    }

 


    async loadEntitiesAsync(engine) {

        this.$entitiesTable.bootstrapTable('showLoading');
        let data_url = `/entities/index/entities?engineId=${engine.id}`;
        let entitiesResponse = await fetch(data_url);
        this.entities = await entitiesResponse.json();

        if (!this.entities)
            this.entities = [];

        this.$entitiesTable.bootstrapTable('updateFormatText', 'formatNoMatches',
            `No entities for engine <strong>${engine.engineName}</strong>. <a href='/entities/new'>Create a new entity</a> for your engine`);

        this.$entitiesTable.bootstrapTable('load', this.entities);

        this.$entitiesTable.bootstrapTable('hideLoading');

    }


    async onUnLoad() {

    }
}

// @ts-check

class entitiesAzureSql {

    constructor() {
        this.isLoaded = false;
    }
    /**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     */
    async loadAsync(htmlFieldPrefix, element, engineId) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/entities/new/entities?dvt=AzureSqlTable&engineId=${engineId}`);

        // get errors labels
        this.$labelErrorDataSources = $("#labelErrorDataSources");
        this.$labelErrorTables = $("#labelErrorTables");

        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);
        // on data sources changes, refresh the tables
        this.$dataSourcesSelect.change(async () => { await this.refreshTablesAsync(engineId); });

        this.$tablesSelect = $(`#${this.htmlFieldPrefix}TableName`);
        this.$tablesSelectString = $(`#${this.htmlFieldPrefix}TablesItemsString`);
        // on table change, set the correct attributes for the preview button
        this.$tablesSelect.change(() => { this.setPreviewDataAttributes(engineId); });

        setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
    }

    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();
        this.$labelErrorTables.empty();

        let dataSourcesUrl = `/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureSqlDatabase`;

        try {

            let r = await fetch(dataSourcesUrl);
            let dataSources = [];

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }

            let dataSourcesJson = await r.json();

            dataSources = dataSourcesJson.map(item => item.name);

            $.each(dataSources, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item, text: item }));
            });

            if (!dataSources.length) {
                this.$dataSourcesSelect.data("noneSelectedText", "No Data Sources...");
                this.$dataSourcesSelectString.val('');

            } else {
                this.$dataSourcesSelectString.val(dataSources.join());

            }
            var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

            if (dataSourceSelected)
                await this.refreshTablesAsync(engineId);

        } catch (e) {
            this.$labelErrorDataSources.text("Unexpected Server error");
            this.$dataSourcesSelect.data("noneSelectedText", "Can't load Data Sources...");

            new modalPanelError$1("errorDataSources", e).show();
        }

        this.$dataSourcesSelect.enablePicker();

    }

    async refreshTablesAsync(engineId) {
        this.$labelErrorTables.empty();

        this.$tablesSelect.disablePicker("loading tables ...");

        let dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();
        let tables = [];
        let tablesUrl = `/api/AzureSqlDatabase/${engineId}/${dataSourceSelected}/tables`;

        try {


            let r = await fetch(tablesUrl);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorTables.text(text.error.message);
                return;
            }

            if (r.status != 400) {
                let tablesJson = await r.json();

                tables = tablesJson.map(item => `${item.schemaName}.${item.tableName}`);

                $.each(tables, (i, item) => {
                    this.$tablesSelect.append($('<option>', { value: item, text: item }));
                });
            }

            if (!tables.length) {
                this.$tablesSelect.data("noneSelectedText", "No Tables...");
                this.$tablesSelectString.val('');
            }
            else {
                this.$tablesSelectString.val(tables.join());
            }

            var tableSelected = $(`#${this.htmlFieldPrefix}TableName option:selected`).val();

            if (tableSelected)
                this.setPreviewDataAttributes(engineId);

        } catch (e) {

            this.$labelErrorTables.text("Unexpected Server error");
            this.$tablesSelect.data("noneSelectedText", "Can't load Data Sources...");

            new modalPanelError$1("errorDataSources", e).show();

        }

        this.$tablesSelect.enablePicker();

    }

    setPreviewDataAttributes(engineId) {
        var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

        if (!dataSourceSelected?.length)
            return;

        var tableSelected = $(`#${this.htmlFieldPrefix}TableName option:selected`).val();

        if (!tableSelected?.length)
            return;

        var tableTab = tableSelected.split(".");
        var schemaName = tableTab[0];
        var tableName = tableTab[1];

        // before refreshing columns, add data to preview buttons
        let $previewEntityButton = $("#previewEntityButton");
        $previewEntityButton.data("engine-id", engineId);
        $previewEntityButton.data("data-source-name", dataSourceSelected);
        $previewEntityButton.data("schema-name", schemaName);
        $previewEntityButton.data("table-name", tableName);
        $previewEntityButton.data("title", `Table preview [${schemaName}].[${tableName}]`);

    }

}

// @ts-check

class entitiesDelimitedText {

    constructor() {
        this.isLoaded = false;
    }

    /**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     */
    async loadAsync(htmlFieldPrefix, element, engineId) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/entities/new/entities?dvt=DelimitedText&engineId=${engineId}`);

        // transform all select picker into selectpicker
        $('select').selectpicker();


        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);
        this.$labelErrorDataSources = $("#labelErrorDataSources");
        // on data sources changes, refresh the tables
        this.$dataSourcesSelect.change(async () => { await this.refreshStoragesPaths(engineId); });


        this.$directoryPathSelect = $(`#${this.htmlFieldPrefix}FullPath`);
        this.$labelErrorDirectoryPath = $("#labelErrorDirectoryPath");


        if (!this.isLoaded) {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }
    }


    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();

        let dataSources = [];
        try {

            let r = await fetch(`/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureBlobStorage`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }
            let dataSourcesJson = await r.json();
            dataSources = dataSourcesJson;

            $.each(dataSources, (i, item) => {

                let value = JSON.stringify(item);

                this.$dataSourcesSelect.append($('<option>', { value: value, text: item.name }));
            });

            r = await fetch(`/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureBlobFS`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }
            dataSourcesJson = await r.json();
            dataSources = dataSourcesJson;
            //dataSources = dataSourcesJson.map(item => item.name);

            $.each(dataSources, (i, item) => {
                let value = JSON.stringify(item);
                this.$dataSourcesSelect.append($('<option>', { value: value, text: item.name }));
            });


            if (!dataSources.length) {
                this.$dataSourcesSelect.data("noneSelectedText", "No Data Sources...");
                this.$dataSourcesSelectString.val('');

            } else {
                this.$dataSourcesSelectString.val(dataSources.join());

            }
            var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

            if (dataSourceSelected)
                await this.refreshStoragesPaths(engineId, dataSourceSelected);

        } catch (e) {
            this.$labelErrorDataSources.text("Unexpected Server error");
            this.$dataSourcesSelect.data("noneSelectedText", "Can't load Data Sources...");

            new modalPanelError$1("error", e).show();
        }

        this.$dataSourcesSelect.enablePicker();

    }


    async refreshStoragesPaths(engineId) {

        this.$directoryPathSelect.empty();
        this.$directoryPathSelect.disablePicker("Loading all paths ...");
        this.$labelErrorDirectoryPath.empty();

        let dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

        let dataSource = JSON.parse(dataSourceSelected);

        let entityLocationTypeElement = $(`#${this.htmlFieldPrefix}LocationType`);

        if (dataSource.dataSourceType === 'AzureBlobStorage')
            entityLocationTypeElement.val('AzureBlobStorageLocation');
        else if (dataSource.dataSourceType === 'AzureBlobFS')
            entityLocationTypeElement.val('AzureBlobFSLocation');



        let directories = [];
        try {

            let r = await fetch(`/api/storages/${engineId}/${dataSource.name}/files`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDirectoryPath.text(text.error.message);
                return;
            }
            let directoriesJson = await r.json();
            directories = directoriesJson.map(item => item.name);

            $.each(directories, (i, item) => {
                this.$directoryPathSelect.append($('<option>', { value: item, text: item }));
            });
        } catch (e) {

            this.$labelErrorDirectoryPath.text("Unexpected Server error");
            this.$directoryPathSelect.data("noneSelectedText", "Can't load Storage files...");

            new modalPanelError$1("error", e).show();
        }

        this.$directoryPathSelect.enablePicker();

    }
}

// @ts-check

class entitiesNewPage extends wizardPage {

    constructor() {
        super('EntityView', '/entities/new/engines');

        this.entitiesAzureSql = new entitiesAzureSql();
        this.entitiesDelimitedText = new entitiesDelimitedText();
        this.lastTypeSelected = '';
    }

    async onLoad() {
        // call base onLoad method
        super.onLoad();

        // init preview panel
        modalPanelPreview.initialize("panelPreview");

        // transform all select picker into selectpicker
        $('select').selectpicker();

        this.$smartWizard.on("leaveStep", (e, anchorObject, currentStepIndex, nextStepIndex, stepDirection) => {

            if (currentStepIndex == 1 && nextStepIndex == 2) {

                let type = $(`input[name="EntityView.EntityType"]:checked`).val();

                if (!type) {
                    return false;
                }

                if (type !== 'AzureSqlTable' && type !== 'DelimitedText') {
                    new modalPanelError$1('entityStepNotExist', 'this entity is not yet implemented...').show();
                    return false;
                }

                this.$smartWizard.smartWizard("goToStep", 1);

            }

            return true;
        });

        this.$smartWizard.on("stepContent", async (e, anchorObject, stepNumber, stepDirection) => {

            if (stepNumber == 2) {

                try {

                    if (this.$engineIdElement) {
                        let engineId = this.$engineIdElement.val().toString();

                        if (!engineId?.length) {
                            this.$smartWizard.smartWizard("goToStep", 1);
                            return;
                        }

                        let type = $(`input[name="EntityView.EntityType"]:checked`).val();

                        if (!type) {
                            this.$smartWizard.smartWizard("goToStep", 1);
                            return;
                        }

                        if (this.lastTypeSelected === type.toString())
                            return;

                        this.lastTypeSelected = type.toString();

                        if (type == 'AzureSqlTable')
                            await this.entitiesAzureSql.loadAsync(this.htmlFieldPrefix, this.$properties, engineId);

                        else if (type == 'DelimitedText')
                            await this.entitiesDelimitedText.loadAsync(this.htmlFieldPrefix, this.$properties, engineId);

                    }

                } catch (e) {

                    this.$smartWizard.smartWizard("goToStep", 0);
                }
            }
        });
    }



    async onUnLoad() {

    }
}

// @ts-check

let jqueryExtends = function () {

    // extend picker
    $.fn.extend({
        disablePicker: function (msg) {
            this.empty();
            this.attr("disabled", "true");
            this.data("noneSelectedText", msg);
            this.selectpicker('refresh');
        }
    });

    $.fn.extend({
        enablePicker: function () {
            this.removeAttr("disabled");
            this.selectpicker('refresh');
        }
    });


    // extend enable disable of buttons and a href
    $.fn.extend({
        enable: function () {
            this.removeClass('disabled');
            this.prop('disabled', false);
        },
        disable: function () {
            this.addClass('disabled');
            this.prop('disabled', true);
        }
    });



    // extend load async
    $.fn.extend({
        loadAsync: function (data_url) {
            return new Promise((resolve, reject) => {
                this.load(data_url, (response, status, xhr) => {
                    if (status == "error") {
                        reject(response);
                    }
                    resolve(response);
                });
            });
        }
    });

    $.fn.extend({
        testAsync: async function (url) {

            // this is the button which clicked !
            let $btn = this;

            this.parent().removeClass('d-flex align-items-baseline text-nowrap').addClass('d-flex align-items-baseline text-nowrap');

            let btnId = $btn.attr('id');
            let spinnerId = `${btnId}Spinner`;
            let messageId = `${btnId}Message`;

            let $spinnerSpan = $(`#${spinnerId}`);
            let $messageSpan = $(`#${messageId}`);

            if (!$spinnerSpan.length)
                $btn.after(`<span id=${spinnerId} style="display:none;" class="ml-2"><i class="fas fa-spinner fa-spin"></i></span>`);

            $spinnerSpan = $(`#${spinnerId}`);

            if (!$messageSpan.length)
                $spinnerSpan.after(`<span id=${messageId} style="display:none;" class="ml-2"></span>`);

            $messageSpan = $(`#${messageId}`);

            $messageSpan.hide();
            $spinnerSpan.show();

            try {

                let r = await $btn.postAsync(url, false);

                $spinnerSpan.hide();

                if (r.errors || r === false) {

                    let errors = [];

                    if (r && r.errors) {
                        errors = Object.values(r.errors).flatMap(e => e);
                    } else {
                        errors = ["Can't connect"];
                    }

                    let html = `<i class="fas fa-exclamation"></i> ${errors[0]}`;
                    $messageSpan.html(html);
                    $messageSpan.addClass("text-danger").removeClass("text-success");
                } else {
                    let html = '<i class="fas fa-check"></i> connection successful';
                    $messageSpan.html(html);
                    $messageSpan.addClass("text-success").removeClass("text-danger");
                }
                $messageSpan.show();
            } catch (e) {
                new modalPanelError("errorExtensionPost", e).show();
            }

        }
    });

    $.fn.extend({
        postAsync: async function (url, checkIsValid) {

            if (!$("form"))
                return;

            if (checkIsValid) {
                // Launch a validation before
                let isValid = $("form").valid();

                if (!isValid)
                    return;
            }

            let formValues = $('form').serializeArray();

            var formdata = new FormData();
            $.each(formValues, function (i, v) {
                formdata.append(v.name, v.value);
            });

            try {

                let response = await fetch(url, {
                    body: formdata,
                    method: 'POST'
                });

                let responseJson = await response.json();

                if (response.status >= 400 || responseJson === false) {

                    if (checkIsValid) {

                        var container = $(document).find("[data-valmsg-summary=true]"),
                            list = container.find("ul");

                        let errors = [];

                        if (responseJson && responseJson.errors) {
                            errors = Object.values(responseJson.errors).flatMap(e => e);
                        } else {
                            errors = ["Can't connect"];
                        }

                        if (list && list.length) {
                            list.empty();
                            container.addClass("validation-summary-errors").removeClass("validation-summary-valid");

                            $.each(errors, function () {
                                $("<li />").html(this).appendTo(list);
                            });
                        }

                    }
                }
                return responseJson;
            } catch (e) {
                return {
                    errors: {
                        serverException: [e]
                    }
                };
            }

        }
    });
};



//async postAsync() {
//    // First, save the deployment.

//    let token = $('input[name="__RequestVerificationToken"]').val();

//    let response = await fetch('', {
//        method: 'POST',
//        body: `dataSourceView.EngineId=${this.dataSourceView.engineId}` +
//            `&dataSourceView.DataSourceType=${this.dataSourceView.dataSourceType}` +
//            `&dataSourceView.ConnectionString=${this.dataSourceView.connectionString}` +
//            `&__RequestVerificationToken=${token}`,
//        headers: {
//            "Content-type": "application/x-www-form-urlencoded; charset=utf-8"
//        }
//    });

//}

(jqueryExtends)();

// @ts-check

dotmimtable.initialize();

// Initialize home page to register notifications
homePage.current.initialize();

// Initialize auth helper
auth.current.initialize();


mgtloader.setMgtProvider();
mgtloader.interceptMgtLogin();

router$1.register('/Dashboard', dashboardPage);
router$1.register('/Dashboard/Index', dashboardPage);
router$1.register('/Engines', enginesPage);
router$1.register('/Engines/Index', enginesPage);
router$1.register('/Engines/Details', engineDetailsPage);
router$1.register('/Admin/Index', adminPage);
router$1.register('/Admin', adminPage);
router$1.register('/Settings/Index', settingsPage);
router$1.register('/Settings', settingsPage);
router$1.register('/Admin/Details', adminEngineRequestDetailsPage);
router$1.register('/Admin/Deploy', adminDeploymentEnginePage);
router$1.register('/DataSources', dataSourcesPage);
router$1.register('/DataSources/New', dataSourceNew);
router$1.register('/DataSources/Edit', dataSourceEdit);
router$1.register('/Entities', entitiesPage);
router$1.register('/Entities/New', entitiesNewPage);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIkNsaWVudFNyYy9yb3V0ZXIuanMiLCJDbGllbnRTcmMvZGFzaGJvYXJkL2Rhc2hib2FyZFBhZ2UuanMiLCJDbGllbnRTcmMvZW5naW5lcy9lbmdpbmVzUGFnZS5qcyIsIkNsaWVudFNyYy9tb2RhbC9tb2RhbFBhbmVsLmpzIiwiQ2xpZW50U3JjL2NvbnNvbGUyLmpzIiwiQ2xpZW50U3JjL2hlbHBlcnMuanMiLCJDbGllbnRTcmMvaGFuZGxlcnMuanMiLCJDbGllbnRTcmMvbm90aWZpY2F0aW9uLmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxEZWxldGVFbmdpbmUuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbFJlc291cmNlR3JvdXAuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFicmlja3MuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFGYWN0b3J5LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxQcmV2aWV3LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxVc2Vycy5qcyIsIkNsaWVudFNyYy9tb2RhbC9tb2RhbFBhbmVsRXJyb3IuanMiLCJDbGllbnRTcmMvZW5naW5lcy9lbmdpbmVEZXRhaWxzUGFnZS5qcyIsIkNsaWVudFNyYy9kb3RtaW10YWJsZS5qcyIsIkNsaWVudFNyYy9hZG1pbi9hZG1pblBhZ2UuanMiLCJDbGllbnRTcmMvYWRtaW4vYWRtaW5EZXBsb3ltZW50RW5naW5lUGFnZS5qcyIsIkNsaWVudFNyYy9hZG1pbi9hZG1pbkVuZ2luZVJlcXVlc3REZXRhaWxzUGFnZS5qcyIsIkNsaWVudFNyYy9tZ3QuanMiLCJDbGllbnRTcmMvYXV0aC5qcyIsIkNsaWVudFNyYy9ob21lL2hvbWVQYWdlLmpzIiwiQ2xpZW50U3JjL3NldHRpbmdzL3NldHRpbmdzUGFnZS5qcyIsIkNsaWVudFNyYy9ib290c3RyYXBUYWJsZXMvZW5naW5lQm9vdHN0cmFwVGFibGUuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZXNQYWdlLmpzIiwiQ2xpZW50U3JjL3dpemFyZC93aXphcmRQYWdlLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZVNxbC5qcyIsIkNsaWVudFNyYy9kYXRhU291cmNlcy9kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZUNvc21vc0RiLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZUJsb2JTdG9yYWdlLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VOZXcuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZUVkaXQuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNQYWdlLmpzIiwiQ2xpZW50U3JjL2VudGl0aWVzL2VudGl0aWVzQXp1cmVTcWwuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNEZWxpbWl0ZWRUZXh0LmpzIiwiQ2xpZW50U3JjL2VudGl0aWVzL2VudGl0aWVzTmV3UGFnZS5qcyIsIkNsaWVudFNyYy9leHRlbnNpb25zLmpzIiwiQ2xpZW50U3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIu+7vy8vIEB0cy1jaGVjayBcclxuXHJcbmV4cG9ydCBjbGFzcyByb3V0ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFF1ZXJ5UGFyYW1ldGVycyA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKHBzZSkgPT4gdGhpcy5fb25Mb2NhdGlvbkNoYW5nZShwc2UpKTtcclxuXHJcbiAgICAgICAgdGhpcy5faW5pdChsb2NhdGlvbi5ocmVmKTtcclxuXHJcbiAgICAgICAgLy8gY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIGRvY3VtZW50IGlzIHJlYWR5XHJcbiAgICAgICAgLy8gZXZlbnQgYWZ0ZXIgYW4gaGlzdG9yeSBjYWxsYmFjayB3aGl0aCBwb3BzdGF0ZVxyXG4gICAgICAgICQoKCkgPT4gdGhpcy5fcnVuKCkpO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGdldCB0aGUgY3VycmVudCB2aWV3IG5hbWUgKHRoZSAve1ZpZXd9IG5hbWUgcGFnZSlcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudFZpZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyB7e1tdfX0gZ2V0IHRoZSBxdWVyeSBwYXJhbWV0ZXJzXHJcbiAgICAgKi9cclxuICAgIGdldFF1ZXJ5UGFyYW1ldGVycygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHtVUkx9IGdldCB0aGUgY3VycmVudCB1cmxcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudFVybCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VXJsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge29iamVjdH0gZ2V0IHRoZSBjdXJyZW50IHN0YXRlICh1c2VseSBhZnRlciBhIHBvc3QsIGFuZCBkZWNsYXJlZCBmcm9tIHRoZSBub2RlIHZpZXcgaW4ge3N0YXRlfSBvYmplY3QpXHJcbiAgICAgKi9cclxuICAgIGdldEN1cnJlbnRTdGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaW5pdCB0aGUgcm91dGVyIG9uIGVhY2ggdXJsIHJlcXVlc3RlZFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxvYyBjdXJyZW50IGxvY2F0aW9uIGhyZWZcclxuICAgICAqL1xyXG4gICAgX2luaXQobG9jKSB7XHJcbiAgICAgICAgLy90aGlzLmN1cnJlbnRVcmwgPSBuZXcgdXJpanMobG9jKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSBuZXcgVVJMKGxvYyk7XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgY3VycmVudCB2aWV3XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHRoaXMuY3VycmVudFVybC5wYXRobmFtZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBxdWVyeSBwYXJhbWV0ZXJzXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VXJsLnNlYXJjaFBhcmFtcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXJ5UGFyYW1ldGVycy5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICogQHBhcmFtIHtQb3BTdGF0ZUV2ZW50fSBwb3BTdGF0ZUV2ZW50IFxyXG4gICAgKi9cclxuICAgIF9vbkxvY2F0aW9uQ2hhbmdlKHBvcFN0YXRlRXZlbnQpIHtcclxuICAgICAgICB2YXIgc3JjRWxlbSA9IHBvcFN0YXRlRXZlbnQuc3JjRWxlbWVudDtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmICghc3JjRWxlbSB8fCAhc3JjRWxlbS5sb2NhdGlvbilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSAmJiB0aGlzLmN1cnJlbnRQYWdlLm9uVW5sb2FkKVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlLm9uVW5sb2FkKCk7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLl9pbml0KHNyY0VsZW0ubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgdGhpcy5fcnVuKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIF9jcmVhdGVJbnN0YW5jZShjb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIHZhciBmYWN0b3J5ID0gY29uc3RydWN0b3IuYmluZC5hcHBseShjb25zdHJ1Y3RvciwgYXJndW1lbnRzKTtcclxuICAgICAgICByZXR1cm4gbmV3IGZhY3RvcnkoKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtzdGF0ZV0gXHJcbiAgICAgKi9cclxuICAgIG5hdmlnYXRlVG8odXJsLCBzdGF0ZSkge1xyXG5cclxuICAgICAgICBpZiAodXJsID09PSB0aGlzLmN1cnJlbnRVcmwucGF0aG5hbWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlID8gc3RhdGUgOiB7fSwgXCJcIiwgdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhOYW1lIDogcGF0aG5hbWUgdXJpXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYWdlSGFuZGxlclxyXG4gICAgKi9cclxuICAgIHJlZ2lzdGVyKHBhdGhOYW1lLCBwYWdlSGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMubWFwLnNldChwYXRoTmFtZSwgcGFnZUhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIF9ydW4oKSB7XHJcblxyXG4gICAgICAgIGlmICghJClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9ICQoXCIjcm91dGVyU3RhdGVcIikudmFsKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBKU09OLnBhcnNlKHRoaXMuY3VycmVudFN0YXRlKTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRLZXk7XHJcblxyXG4gICAgICAgIHRoaXMubWFwLmZvckVhY2goKHYsIGspID0+IHtcclxuICAgICAgICAgICAgdmFyIHIgPSBuZXcgUmVnRXhwKGssICdpJyk7XHJcbiAgICAgICAgICAgIGxldCBpc01hdGNoID0gci50ZXN0KHRoaXMuY3VycmVudFZpZXcpO1xyXG4gICAgICAgICAgICBpZiAoaXNNYXRjaClcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRLZXkgPSBrO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmICghY3VycmVudEtleSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudFBhZ2VDdG9yID0gdGhpcy5tYXAuZ2V0KGN1cnJlbnRLZXkpO1xyXG5cclxuICAgICAgICBpZiAoIWN1cnJlbnRQYWdlQ3RvcilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy5fY3JlYXRlSW5zdGFuY2UoY3VycmVudFBhZ2VDdG9yKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYWdlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlLm9uTG9hZCkge1xyXG4gICAgICAgICAgICAkKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2Uub25Mb2FkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyb3V0ZXIgaGFzIGxvYWRlZCBwYWdlIFwiICsgdGhpcy5jdXJyZW50Vmlldyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQpIHtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdiZWZvcmV1bmxvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlLm9uVW5sb2FkKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8vIHNpbmdsZXRvblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgcm91dGVyKCk7XHJcblxyXG5cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4uL3JvdXRlci5qc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBkYXNoYm9hcmRQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFnZUluZGV4IGdldCB0aGUgY3VycmVudCBwYWdlIGluZGV4XHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlZnJlc2gocGFnZUluZGV4KSB7XHJcbiAgICB9XHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgY2xhc3MgZW5naW5lc1BhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoaWQpIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5fc2hvd25QYW5lbCA9IChlKSA9PiB7IH07XHJcbiAgICAgICAgdGhpcy5fc2hvd1BhbmVsID0gKGUpID0+IHsgfTtcclxuICAgICAgICB0aGlzLl91bmxvYWRQYW5lbCA9IChlKSA9PiB7IH07XHJcbiAgICAgICAgdGhpcy5fbGFyZ2UgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gXCJyaWdodFwiO1xyXG4gICAgICAgIHRoaXMuX2NlbnRlciA9IFwiXCI7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYW5lbCgpICYmIHRoaXMucGFuZWwoKS5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgbGV0IG1vZGFsSHRtbERpdiA9IHRoaXMuX2dlbmVyYXRlTW9kYWxIdG1sKCk7XHJcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChtb2RhbEh0bWxEaXYpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgc20oKSB7XHJcbiAgICAgICAgdGhpcy5fbGFyZ2UgPSBcIlwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbGcoKSB7XHJcbiAgICAgICAgdGhpcy5fbGFyZ2UgPSBcIiBtb2RhbC1sZ1wiO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICB4bCgpIHtcclxuICAgICAgICB0aGlzLl9sYXJnZSA9IFwiIG1vZGFsLXhsXCI7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBcIlwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgcmVhZG9ubHkoKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YV9yZWFkb25seSA9ICdkYXRhLWJhY2tkcm9wPVwic3RhdGljXCIgZGF0YS1rZXlib2FyZD1cImZhbHNlXCIgJztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjZW50ZXIoKSB7XHJcbiAgICAgICAgdGhpcy5fY2VudGVyID0gXCJtb2RhbC1kaWFsb2ctY2VudGVyZWQgbW9kYWwtZGlhbG9nLXNjcm9sbGFibGVcIjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25TaG93bihzaG93blBhbmVsRXZlbnQpIHsgdGhpcy5wYW5lbCgpLm9uKCdzaG93bi5icy5tb2RhbCcsIHNob3duUGFuZWxFdmVudCkgfVxyXG5cclxuICAgIG9uU2hvdyhzaG93UGFuZWxFdmVudCkgeyB0aGlzLnBhbmVsKCkub24oJ3Nob3cuYnMubW9kYWwnLCBzaG93UGFuZWxFdmVudCkgfVxyXG5cclxuICAgIG9uVW5Mb2FkKHVubG9hZFBhbmVsRXZlbnQpIHsgdGhpcy5wYW5lbCgpLm9uKCdoaWRlLmJzLm1vZGFsJywgdW5sb2FkUGFuZWxFdmVudCkgfVxyXG5cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MRWxlbWVudD59ICovXHJcbiAgICBwYW5lbCgpIHsgcmV0dXJuICQoYCMke3RoaXMuaWR9YCkgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxCdXR0b25FbGVtZW50Pn0gKi9cclxuICAgIHN1Ym1pdEJ1dHRvbigpIHsgcmV0dXJuICQoYCMke3RoaXMuaWR9U3VibWl0QnV0dG9uYCkgfVxyXG5cclxuICAgIC8qKiAgQHJldHVybnMge0pRdWVyeTxIVE1MQnV0dG9uRWxlbWVudD59ICovXHJcbiAgICBkZWxldGVCdXR0b24oKSB7XHJcbiAgICAgICAgcmV0dXJuICQoYCMke3RoaXMuaWR9RGVsZXRlQnV0dG9uYClcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVCdXR0b25UZXh0KHRleHQpIHtcclxuICAgICAgICAkKGAjJHt0aGlzLmlkfURlbGV0ZUJ1dHRvblRleHRgKS50ZXh0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MQnV0dG9uRWxlbWVudD59Ki9cclxuICAgIGNsb3NlQnV0dG9uKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1DbG9zZUJ1dHRvbmApIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MRGl2RWxlbWVudD59Ki9cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGJvZHkoKSB7IHJldHVybiAkKGAjJHt0aGlzLmlkfUJvZHlgKSB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtKUXVlcnk8SFRNTEhSRWxlbWVudD59Ki9cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRpdGxlKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1UaXRsZWApIH1cclxuXHJcblxyXG4gICAgX2dlbmVyYXRlTW9kYWxIdG1sKCkge1xyXG5cclxuICAgICAgICBsZXQgbW9kYWwgPSBgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsICR7dGhpcy5fcG9zaXRpb259IGZhZGVcIiBpZD1cIiR7dGhpcy5pZH1cIiB0YWJpbmRleD1cIi0xXCIgJHt0aGlzLl9kYXRhX3JlYWRvbmx5fWFyaWEtbGFiZWxsZWRieT1cIiR7dGhpcy5pZH1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZyR7dGhpcy5fbGFyZ2V9ICR7dGhpcy5fY2VudGVyfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQke3RoaXMuX2xhcmdlfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIiBpZD1cIiR7dGhpcy5pZH1UaXRsZVwiPjwvaDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIiBpZD1cIiR7dGhpcy5pZH1Cb2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFyayBidG4tc21cIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGlkPVwiJHt0aGlzLmlkfUNsb3NlQnV0dG9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS11bmRvXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2xvc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbVwiIGlkPVwiJHt0aGlzLmlkfVN1Ym1pdEJ1dHRvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtc2F2ZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN1Ym1pdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRhbmdlciBidG4tc21cIiBpZD1cIiR7dGhpcy5pZH1EZWxldGVCdXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRyYXNoLWFsdFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiJHt0aGlzLmlkfURlbGV0ZUJ1dHRvblRleHRcIj5EZWxldGU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmA7XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RhbDtcclxuICAgIH1cclxuXHJcbn1cclxuIiwi77u/XHJcblxyXG5leHBvcnQgY2xhc3MgY29uc29sZTIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtKUXVlcnk8SFRNTERpdkVsZW1lbnQ+fSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRGl2RWxlbWVudD59IHBhcmVudE92ZXJmbG93RWxlbWVudFxyXG4gICAgICoqL1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgcGFyZW50T3ZlcmZsb3dFbGVtZW50ID0gbnVsbCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMiA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50ID0gcGFyZW50T3ZlcmZsb3dFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50KVxyXG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsVG9wID0gdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50LnBvc2l0aW9uKCkudG9wO1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgd2luZG93LlByaXNtID0gd2luZG93LlByaXNtIHx8IHt9O1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB3aW5kb3cuUHJpc20ubWFudWFsID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWd0bG9naW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWd0bG9naW4nKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgX3VzZXJOYW1lKCkge1xyXG5cclxuICAgICAgICBsZXQgdXNlck5hbWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbWd0bG9naW4gJiYgdGhpcy5fbWd0bG9naW4udXNlckRldGFpbHMpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBtYWlsID0gdGhpcy5fbWd0bG9naW4udXNlckRldGFpbHMuZW1haWw7XHJcbiAgICAgICAgICAgIGlmICghbWFpbClcclxuICAgICAgICAgICAgICAgIG1haWwgPSB0aGlzLl9tZ3Rsb2dpbi51c2VyRGV0YWlscy51c2VyUHJpbmNpcGFsTmFtZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuYW1lTWF0Y2ggPSBtYWlsLm1hdGNoKC9eKFteQF0qKUAvKTtcclxuICAgICAgICAgICAgdXNlck5hbWUgPSBuYW1lTWF0Y2ggPyBuYW1lTWF0Y2hbMV0gOiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVzZXJOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIF9zY3JvbGxUb0VuZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3BhcmVudE92ZXJmbG93RWxlbWVudClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5fY29uc29sZTIuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIG5ld1BvcyA9IHRoaXMuX2luaXRpYWxUb3AgKyBoZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuX3BhcmVudE92ZXJmbG93RWxlbWVudC5zY3JvbGxUbyhuZXdQb3MsIDEwMCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZE9iamVjdChqc29uT2JqZWN0KSB7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBsZXQganNvblN0cmluZyA9IFByaXNtLmhpZ2hsaWdodChKU09OLnN0cmluZ2lmeShqc29uT2JqZWN0LCBudWxsLCAyKSwgUHJpc20ubGFuZ3VhZ2VzLmpzb24sICdqc29uJyk7XHJcblxyXG4gICAgICAgIGxldCBzdHIgPSBcIjxwcmUgY2xhc3M9J21sLTMgbXItMyBtdC0zJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjp3aGl0ZTt3aGl0ZS1zcGFjZTpwcmUtd3JhcDt3aWR0aDo5MCU7bWF4LWhlaWdodDoyNTBweDsnPjxjb2RlPlwiO1xyXG4gICAgICAgIHN0ciArPSBqc29uU3RyaW5nO1xyXG4gICAgICAgIHN0ciArPSBcIjwvY29kZT48L3ByZT5cIjtcclxuXHJcbiAgICAgICAgdGhpcy5fY29uc29sZTIuYXBwZW5kKHN0cik7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9FbmQoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhcHBlbmRXYXJuaW5nKGxpbmUpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0ciA9IGA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93XCI+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC13YXJuaW5nXCI+JHt0aGlzLl91c2VyTmFtZSgpfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+Ojwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdhcm5pbmdcIj5+JCZuYnNwOzwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+JHtsaW5lfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgdGhpcy5fY29uc29sZTIuYXBwZW5kKHN0cik7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9FbmQoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kRXJyb3IobGluZSkge1xyXG5cclxuICAgICAgICBsZXQgc3RyID0gYDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1yb3dcIj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPiR7dGhpcy5fdXNlck5hbWUoKX08L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC13aGl0ZVwiPjo8L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC1kYW5nZXJcIj5+JCZuYnNwOzwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+JHtsaW5lfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgdGhpcy5fY29uc29sZTIuYXBwZW5kKHN0cik7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9FbmQoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9nKGxpbmUpIHsgdGhpcy5hcHBlbmRMaW5lKGxpbmUpOyB9XHJcbiAgICBpbmZvKGxpbmUpIHsgdGhpcy5hcHBlbmRMaW5lKGxpbmUpOyB9XHJcbiAgICBlcnJvcihsaW5lKSB7IHRoaXMuYXBwZW5kRXJyb3IobGluZSk7IH1cclxuICAgIHdhcm4obGluZSkgeyB0aGlzLmFwcGVuZFdhcm5pbmcobGluZSk7IH1cclxuXHJcblxyXG4gICAgYXBwZW5kTGluZShsaW5lKSB7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzdHIgPSBgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXJvd1wiPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPiR7dGhpcy5fdXNlck5hbWUoKX08L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC13aGl0ZVwiPjo8L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+fiQmbmJzcDs8L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC13aGl0ZVwiPiR7bGluZX08L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gJzwvZGl2Pic7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnNvbGUyLmFwcGVuZChzdHIpO1xyXG4gICAgICAgIHRoaXMuX3Njcm9sbFRvRW5kKCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XHJcbn1cclxuXHJcbi8vZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZSgpIHtcclxuLy8gICAgdGhpcy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuLy8gICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuLy99XHJcbi8vZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbi8vICAgIHRoaXMuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbi8vICAgIHRoaXMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcclxuXHJcbi8vfVxyXG5cclxuLy8vKipcclxuLy8gKiBAcGFyYW0ge3N0cmluZ30gZGF0YV91cmxcclxuLy8gKiBAcGFyYW0ge0pRdWVyeTxIVE1MRWxlbWVudD59IGVsZW1lbnRcclxuLy8gKi9cclxuLy9leHBvcnQgZnVuY3Rpb24gbG9hZFBhcnRpYWxBc3luYyhkYXRhX3VybCwgZWxlbWVudCkge1xyXG4vLyAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4vLyAgICAgICAgZWxlbWVudC5sb2FkKGRhdGFfdXJsLCAocmVzcG9uc2UsIHN0YXR1cywgeGhyKSA9PiB7XHJcbi8vICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBcImVycm9yXCIpIHtcclxuLy8gICAgICAgICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcclxuLy8gICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbi8vICAgICAgICB9KTtcclxuLy8gICAgfSk7XHJcbi8vfVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIGhhbmRsZXJzIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLm1ldGhvZHMgPSB7fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZVxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3TWV0aG9kXHJcbiAgICAgKi9cclxuICAgIG9uKG1ldGhvZE5hbWUsIG5ld01ldGhvZCkge1xyXG4gICAgICAgIGlmICghbWV0aG9kTmFtZSB8fCAhbmV3TWV0aG9kKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1ldGhvZE5hbWUgPSBtZXRob2ROYW1lLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGhhbmRsZXJzIGFscmVhZHksIGNyZWF0ZSBhbiBlbXB0eSBhcnJheVxyXG4gICAgICAgIGlmICghdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWV0aG9kc1ttZXRob2ROYW1lXSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUHJldmVudGluZyBhZGRpbmcgdGhlIHNhbWUgaGFuZGxlciBtdWx0aXBsZSB0aW1lcy5cclxuICAgICAgICBpZiAodGhpcy5tZXRob2RzW21ldGhvZE5hbWVdLmluZGV4T2YobmV3TWV0aG9kKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRkIHRoZSBtZXRob2QgdG8gdGhlIGhhbmRsZXIgbGlzdFxyXG4gICAgICAgIHRoaXMubWV0aG9kc1ttZXRob2ROYW1lXS5wdXNoKG5ld01ldGhvZCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5yZWdpc3RlciBhbiBoYW5kbGVyXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZSBtZXRob2QgbmFtZVxyXG4gICAgICogQHBhcmFtIHthbnl9IG1ldGhvZCAoLi4uYXJnczogYW55W10pID0+IHZvaWRcclxuICAgICAqL1xyXG4gICAgb2ZmKG1ldGhvZE5hbWUsIG1ldGhvZCkge1xyXG4gICAgICAgIGlmICghbWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtZXRob2ROYW1lID0gbWV0aG9kTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAvLyBnZXQgYWxsIGhhbmRsZXJzIHdpdGggdGhpcyBtZXRob2QgbmFtZVxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXJzID0gdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdO1xyXG5cclxuICAgICAgICAvLyBpZiBoYW5kbGVycyBkbyBub3QgZXhpc3RzLCByZXR1cm5cclxuICAgICAgICBpZiAoIWhhbmRsZXJzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBmdW5jdGlvbiBleGlzdGluZ1xyXG4gICAgICAgIGlmIChtZXRob2QpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gYWxsIGhhbmRsZXJzXHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZUlkeCA9IGhhbmRsZXJzLmluZGV4T2YobWV0aG9kKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIHdlIGZvdW5kIGl0LCBtYWtlIGEgc3BsaWNlIGluIHRoZSBoYW5kbGVycyBsaXN0XHJcbiAgICAgICAgICAgIGlmIChyZW1vdmVJZHggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVycy5zcGxpY2UocmVtb3ZlSWR4LCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpZiBubyBtb3JlIGhhbmRsZXJzLCBkZWxldGVcclxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMubWV0aG9kc1ttZXRob2ROYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldCAgIFxyXG4gICAgICovXHJcbiAgICBpbnZva2UodGFyZ2V0LCAuLi5wYXJhbWV0ZXJzKSB7XHJcblxyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgbWV0aG9kcyBhcnJheSB0byBpbnZva2VcclxuICAgICAgICBjb25zdCBtZXRob2RzID0gdGhpcy5tZXRob2RzW3RhcmdldC50b0xvd2VyQ2FzZSgpXTtcclxuXHJcbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhdCBsZWFzdCBvbiBtZXRob2QgaW4gdGhlIG1ldGhvZHMgYXJyYXkgdG8gaW52b2tlXHJcbiAgICAgICAgaWYgKG1ldGhvZHMpIHtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtIG9mIG1ldGhvZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBtLmFwcGx5KF90aGlzLCBwYXJhbWV0ZXJzKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgQSBjYWxsYmFjayBmb3IgdGhlIG1ldGhvZCAke3RhcmdldC50b0xvd2VyQ2FzZSgpfSB0aHJldyBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYE5vIGNsaWVudCBtZXRob2Qgd2l0aCB0aGUgbmFtZSAnJHt0YXJnZXQudG9Mb3dlckNhc2UoKX0nIGZvdW5kLmApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuIiwi77u/Ly8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3d3d3Jvb3QvbGliL3NpZ25hbHIvZGlzdC9icm93c2VyL3NpZ25hbHIuanNcIiAvPlxyXG5cclxuaW1wb3J0IHsgZGVsYXkgfSBmcm9tIFwiLi9oZWxwZXJzLmpzXCI7XHJcbmltcG9ydCB7IGhhbmRsZXJzIH0gZnJvbSBcIi4vaGFuZGxlcnMuanNcIlxyXG5cclxuLy8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgY2xhc3Mgbm90aWZpY2F0aW9uIHtcclxuXHJcbiAgICAvLyBzaW5nbGV0b25cclxuICAgIHN0YXRpYyBfY3VycmVudDtcclxuXHJcbiAgICAvKiogQHJldHVybnMge25vdGlmaWNhdGlvbn0gKi9cclxuICAgIHN0YXRpYyBnZXQgY3VycmVudCgpIHtcclxuICAgICAgICBpZiAoIW5vdGlmaWNhdGlvbi5fY3VycmVudClcclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLl9jdXJyZW50ID0gbmV3IG5vdGlmaWNhdGlvbigpO1xyXG5cclxuICAgICAgICByZXR1cm4gbm90aWZpY2F0aW9uLl9jdXJyZW50O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLy8gZXZlbnRzXHJcbiAgICBzdGF0aWMgT25TdGFydGVkID0gXCJPblN0YXJ0ZWRcIjtcclxuICAgIHN0YXRpYyBPblN0b3BwZWQgPSBcIk9uU3RvcHBlZFwiO1xyXG4gICAgc3RhdGljIE9uQ29ubmVjdGVkID0gXCJPbkNvbm5lY3RlZFwiO1xyXG4gICAgc3RhdGljIE9uQ29ubmVjdGluZyA9IFwiT25Db25uZWN0aW5nXCI7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZXJzID0gbmV3IGhhbmRsZXJzKCk7XHJcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9pc1N0YXJ0aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG5ldyBzaWduYWxSLkh1YkNvbm5lY3Rpb25CdWlsZGVyKClcclxuICAgICAgICAgICAgLmNvbmZpZ3VyZUxvZ2dpbmcoc2lnbmFsUi5Mb2dMZXZlbC5Ob25lKVxyXG4gICAgICAgICAgICAud2l0aFVybCgnL25vdGlmaWNhdGlvbnMnKVxyXG4gICAgICAgICAgICAud2l0aEF1dG9tYXRpY1JlY29ubmVjdCgpXHJcbiAgICAgICAgICAgIC5jb25maWd1cmVMb2dnaW5nKHNpZ25hbFIuTG9nTGV2ZWwuVHJhY2UpXHJcbiAgICAgICAgICAgIC5idWlsZCgpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub25yZWNvbm5lY3RpbmcoZXJyb3IgPT4gdGhpcy5fY29uc29sZS5sb2coZXJyb3IpKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub25jbG9zZShlcnJvciA9PiB0aGlzLm9uQ29ubmVjdGlvbkVycm9yKGVycm9yKSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbihcImNvbm5lY3RlZFwiLCAoXykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLmludm9rZShub3RpZmljYXRpb24uT25Db25uZWN0ZWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzdGFydCgpIHtcclxuICAgICAgICBsZXQgcmV0cnlDb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc1N0YXJ0aW5nKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuX2lzU3RhcnRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICB3aGlsZSAoIXRoaXMuX2lzQ29ubmVjdGVkICYmIHJldHJ5Q291bnQgPCA1KSB7XHJcblxyXG4gICAgICAgICAgICByZXRyeUNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNDb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uLnN0YXRlID09IHNpZ25hbFIuSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMuaW52b2tlKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGF3YWl0IGRlbGF5KDE1MDApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzQ29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0Nvbm5lY3RlZCB8fCByZXRyeUNvdW50ID49IDUpIHtcclxuICAgICAgICAgICAgdGhpcy5faXNTdGFydGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gbWFueSB0cmllcyB0byBjb25uZWN0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faGFuZGxlcnMuaW52b2tlKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzdG9wKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uLnN0YXRlICE9IHNpZ25hbFIuSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uc3RvcCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5pbnZva2Uobm90aWZpY2F0aW9uLk9uU3RvcHBlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lzU3RhcnRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXHJcbiAgICAgKi9cclxuICAgIG9uKG1ldGhvZCwgaGFuZGxlcikge1xyXG4gICAgICAgIGlmIChtZXRob2QgPT0gbm90aWZpY2F0aW9uLk9uQ29ubmVjdGVkIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0aW5nIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25TdGFydGVkIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25TdG9wcGVkKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5vbihtZXRob2QsIGhhbmRsZXIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9uKG1ldGhvZCwgaGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2RcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcclxuICAgICAqL1xyXG4gICAgb2ZmKG1ldGhvZCwgaGFuZGxlcikge1xyXG4gICAgICAgIGlmIChtZXRob2QgPT0gbm90aWZpY2F0aW9uLk9uQ29ubmVjdGVkIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0aW5nIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25TdGFydGVkIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25TdG9wcGVkKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5vZmYobWV0aG9kLCBoYW5kbGVyKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5vZmYobWV0aG9kLCBoYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgb25Db25uZWN0aW9uRXJyb3IoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3IgJiYgZXJyb3IubWVzc2FnZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4vbW9kYWxQYW5lbC5qc1wiO1xyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuLi9ub3RpZmljYXRpb24uanNcIlxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsRGVsZXRlRW5naW5lIHtcclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb2RhbFBhbmVsRGVsZXRlRW5naW5lKG1vZGFsX2RhdGFfdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RhbF9kYXRhX3RhcmdldCBtb2RhbCBhdHRyaWJ1dGUgZGF0YS10YXJnZXRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbF9kYXRhX3RhcmdldCA9IG1vZGFsX2RhdGFfdGFyZ2V0O1xyXG4gICAgICAgIC8vIEdldCB0aGUgc21hbGwgbW9kYWxcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLmxnKCkuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5jbGljayhhc3luYyAoZXZlbnQpID0+IHsgYXdhaXQgdGhpcy5kZWxldGVFbmdpbmVBc3luYyhldmVudCkgfSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2PiZuYnNwOzwvZGl2PlwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb25zb2xlJz48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSBKUXVlcnk8SFRNTERpdkVsZW1lbnQ+ICovXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZUVsZW1lbnQgPSB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5maW5kKCcuY29uc29sZScpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZSA9IG5ldyBjb25zb2xlMih0aGlzLmRlbGV0ZUNvbnNvbGVFbGVtZW50LCB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKSk7XHJcblxyXG4gICAgICAgIC8vIHN1YnNjcmliZSB0byBldmVudCBmcm9tIHNpZ25hbHIgYWJvdXQgZGVwbG95bWVudFxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdGFydGVkLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIHN0YXJ0ZWQuXCIpKTtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0aW5nLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RpbmcuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCwgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0b3BwZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgc3RvcHBlZC5cIikpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLCBhbmQgc2V0IGl0IGdsb2JhbHlcclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXF1ZXN0UmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlcXVlc3RSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICQobG9jYXRpb24pLmF0dHIoJ2hyZWYnLCAnL0FkbWluL0luZGV4Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXF1ZXN0ID0gYXdhaXQgZW5naW5lUmVxdWVzdFJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGltZW91dCBvZiB0aGUgcGFnZSBmb3Igc29tZSByZWFzb24gP1xyXG4gICAgICAgIGlmICghZW5naW5lUmVxdWVzdCkge1xyXG4gICAgICAgICAgICAkKGxvY2F0aW9uKS5hdHRyKCdocmVmJywgJy8nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5zaG93KCk7XHJcblxyXG4gICAgICAgICQoXCI8ZGl2IGNsYXNzPSdtLTInPkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgZW5naW5lIDxiPlwiICsgZW5naW5lUmVxdWVzdC5lbmdpbmVOYW1lICsgXCI8L2I+ID88L2Rpdj5cIikuaW5zZXJ0QmVmb3JlKHRoaXMuZGVsZXRlQ29uc29sZUVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIlJlYWR5IHRvIGRlbGV0ZS4gUGxlYXNlIHByZXNzICdEZWxldGUnIGJ1dHRvbiB0byBzdGFydC5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7SlF1ZXJ5LkNsaWNrRXZlbnQ8SFRNTEJ1dHRvbkVsZW1lbnQsIG51bGwsIEhUTUxCdXR0b25FbGVtZW50LCBIVE1MQnV0dG9uRWxlbWVudD59IGV2dCAqL1xyXG4gICAgYXN5bmMgZGVsZXRlRW5naW5lQXN5bmMoZXZ0KSB7XHJcblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZW5naW5lSWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZEVycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIHRoZSBlbmdpbmUgcmVxdWVzdCBpZC4uLi5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdldCBub3RpZmljYXRpb24gaGVscGVyXHJcbiAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgLy8gc3Vic2NyaWJlIHRvIHRoaXMgZGVwbG95bWVudCAoZm9yIHRoaXMgdXNlcilcclxuICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5lbmdpbmVJZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiV2FpdGluZyBmb3IgYW4gYWdlbnQgdG8gZW5xdWV1ZSB0aGUgZW5naW5lIGRyb3Agb3BlcmF0aW9uLi4uXCIpO1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBsZXQgdXJsRGVsZXRpb24gPSBgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gO1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmxEZWxldGlvbiwgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kRXJyb3IoYFVuYWJsZSB0byBkZWxldGUgdGhlIGVuZ2luZSByZXF1ZXN0IHdpdGggSWQgJHt0aGlzLmVuZ2luZUlkfSBgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRyb3BFbmdpbmVTdGFydCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUoZHJvcEVuZ2luZVN0YXJ0KVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kRXJyb3IoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9waW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BwZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cCB7XHJcblxyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsRW5naW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyByZW1vdmUgdW5lY2Vzc2FyeSBidXR0b25zXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2PiZuYnNwOzwvZGl2PlwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb25zb2xlJz48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSBKUXVlcnk8SFRNTERpdkVsZW1lbnQ+ICovXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuY29uc29sZUVsZW1lbnQgPSB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5maW5kKCcuY29uc29sZScpO1xyXG4gICAgICAgIHRoaXMuY29uc29sZSA9IG5ldyBjb25zb2xlMih0aGlzLmNvbnNvbGVFbGVtZW50LCB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEdldHRpbmcgaW5mb3JtYXRpb24uLi5gKVxyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLCBhbmQgc2V0IGl0IGdsb2JhbHlcclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2VuZ2luZXMvJHt0aGlzLmVuZ2luZUlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAoZW5naW5lUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZSA9IGF3YWl0IGVuZ2luZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGltZW91dCBvZiB0aGUgcGFnZSBmb3Igc29tZSByZWFzb24gP1xyXG4gICAgICAgIGlmICghZW5naW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBlbmdpbmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgUmVzb3VyY2UgZ3JvdXAgPHN0cm9uZz4ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX08L3N0cm9uZz4gLi4uYClcclxuXHJcbiAgICAgICAgbGV0IHJnUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9yZXNvdXJjZWdyb3Vwcy8ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJnUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgcmVzb3VyY2UgZ3JvdXAgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2VHcm91cCA9IGF3YWl0IHJnUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHJlc291cmNlR3JvdXApO1xyXG5cclxuICAgICAgICBsZXQgcmdMaW5rUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9yZXNvdXJjZWdyb3Vwcy8ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX0vbGlua2AsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaWQ6IHJlc291cmNlR3JvdXAuaWQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJnTGlua1Jlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IHJlc291cmNlIGdyb3VwIGxpbmsuXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlc291cmNlR3JvdXBMaW5rID0gYXdhaXQgcmdMaW5rUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgQXp1cmUgcmVzb3VyY2UgZ3JvdXAgbGluayA6IDxhIGhyZWY9JHtyZXNvdXJjZUdyb3VwTGluay51cml9IHRhcmdldD1cIl9ibGFua1wiPiR7cmVzb3VyY2VHcm91cC5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRG9uZS5gKVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBlZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIG1vZGFsUGFuZWxEYXRhYnJpY2tzIHtcclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb2RhbFBhbmVsRGF0YWJyaWNrcyhtb2RhbF9kYXRhX3RhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxfZGF0YV90YXJnZXQgPSBtb2RhbF9kYXRhX3RhcmdldDtcclxuICAgICAgICAvLyBHZXQgdGhlIHNtYWxsIG1vZGFsXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZSA9IG5ldyBtb2RhbFBhbmVsKG1vZGFsX2RhdGFfdGFyZ2V0KS5sZygpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25TaG93bihlID0+IHRoaXMuc2hvd25QYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxFbmdpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgc2hvd1BhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSB1bmVjZXNzYXJ5IGJ1dHRvbnNcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS50aXRsZSgpLnRleHQodGl0bGVTdHJpbmcpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmFwcGVuZChcIjxkaXY+Jm5ic3A7PC9kaXY+XCIpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmFwcGVuZChcIjxkaXYgY2xhc3M9J2NvbnNvbGUnPjwvZGl2PlwiKTtcclxuXHJcbiAgICAgICAgLyoqIEB0eXBlIEpRdWVyeTxIVE1MRGl2RWxlbWVudD4gKi9cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5jb25zb2xlRWxlbWVudCA9IHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmZpbmQoJy5jb25zb2xlJyk7XHJcbiAgICAgICAgdGhpcy5jb25zb2xlID0gbmV3IGNvbnNvbGUyKHRoaXMuY29uc29sZUVsZW1lbnQsIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbi4uLmApXHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgZW5naW5lIHJlcXVlc3QgaWQsIGFuZCBzZXQgaXQgZ2xvYmFseVxyXG4gICAgICAgIHRoaXMuZW5naW5lSWQgPSBidXR0b24uZGF0YSgnZW5naW5lLWlkJylcclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZVJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvZW5naW5lcy8ke3RoaXMuZW5naW5lSWR9YCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChlbmdpbmVSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBlbmdpbmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lID0gYXdhaXQgZW5naW5lUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICAvLyB0aW1lb3V0IG9mIHRoZSBwYWdlIGZvciBzb21lIHJlYXNvbiA/XHJcbiAgICAgICAgaWYgKCFlbmdpbmUpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBSZXNvdXJjZSBncm91cDogPHN0cm9uZz4ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX08L3N0cm9uZz4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRGF0YWJyaWNrcyB3b3Jrc3BhY2U6IDxzdHJvbmc+JHtlbmdpbmUuY2x1c3Rlck5hbWV9PC9zdHJvbmc+LmApXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEdldHRpbmcgaW5mb3JtYXRpb24gZnJvbSBBenVyZS4uLmApXHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZVJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvZGF0YWJyaWNrcy8ke2VuZ2luZS5pZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJlc291cmNlUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZGF0YWJyaWNrcyBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZSA9IGF3YWl0IHJlc291cmNlUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHJlc291cmNlKTtcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlTGlua1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvcmVzb3VyY2Vncm91cHMvJHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9L2xpbmtgLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGlkOiByZXNvdXJjZS5pZCB9KSxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VMaW5rUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgcmVzb3VyY2UgbGluay5cIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzb3VyY2VMaW5rID0gYXdhaXQgcmVzb3VyY2VMaW5rUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgQXp1cmUgRGF0YWJyaWtzIHdvcmtzcGFjZSBsaW5rOiA8YSBocmVmPVwiJHtyZXNvdXJjZUxpbmsudXJpfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7cmVzb3VyY2UubmFtZX08L2E+YClcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYERhdGFicmlja3Mgd29ya3NwYWNlIGxpbms6IDxhIGhyZWY9XCJodHRwczovLyR7cmVzb3VyY2UucHJvcGVydGllcy53b3Jrc3BhY2VVcmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtyZXNvdXJjZS5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbiBmcm9tIERhdGFicmlja3MuLi5gKVxyXG5cclxuICAgICAgICByZXNvdXJjZVJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvZGF0YWJyaWNrcy8ke2VuZ2luZS5pZH0vY2x1c3RlcmApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBkYXRhYnJpY2tzIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzb3VyY2UgPSBhd2FpdCByZXNvdXJjZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdChyZXNvdXJjZSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRG9uZS5gKVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBlZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIG1vZGFsUGFuZWxEYXRhRmFjdG9yeSB7XHJcblxyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbERhdGFGYWN0b3J5KG1vZGFsX2RhdGFfdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RhbF9kYXRhX3RhcmdldCBtb2RhbCBhdHRyaWJ1dGUgZGF0YS10YXJnZXRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbF9kYXRhX3RhcmdldCA9IG1vZGFsX2RhdGFfdGFyZ2V0O1xyXG4gICAgICAgIC8vIEdldCB0aGUgc21hbGwgbW9kYWxcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLmxnKCkuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHVuZWNlc3NhcnkgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdj4mbmJzcDs8L2Rpdj5cIik7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdiBjbGFzcz0nY29uc29sZSc+PC9kaXY+XCIpO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUgSlF1ZXJ5PEhUTUxEaXZFbGVtZW50PiAqL1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmNvbnNvbGVFbGVtZW50ID0gdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZmluZCgnLmNvbnNvbGUnKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUgPSBuZXcgY29uc29sZTIodGhpcy5jb25zb2xlRWxlbWVudCwgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uLi4uYClcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBlbmdpbmUgcmVxdWVzdCBpZCwgYW5kIHNldCBpdCBnbG9iYWx5XHJcbiAgICAgICAgdGhpcy5lbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmUgPSBhd2FpdCBlbmdpbmVSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIC8vIHRpbWVvdXQgb2YgdGhlIHBhZ2UgZm9yIHNvbWUgcmVhc29uID9cclxuICAgICAgICBpZiAoIWVuZ2luZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYFJlc291cmNlIGdyb3VwIDxzdHJvbmc+JHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9PC9zdHJvbmc+IC4uLmApXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYERhdGEgZmFjdG9yeSBWMjogPHN0cm9uZz4ke2VuZ2luZS5mYWN0b3J5TmFtZX08L3N0cm9uZz4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbiBmcm9tIEF6dXJlLi4uYClcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lLmlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBkYXRhIGZhY3RvcnkgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2UgPSBhd2FpdCByZXNvdXJjZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdChyZXNvdXJjZSk7XHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZUxpbmtSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL3Jlc291cmNlZ3JvdXBzLyR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfS9saW5rYCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpZDogcmVzb3VyY2UuaWQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJlc291cmNlTGlua1Jlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IHJlc291cmNlIGdyb3VwIGxpbmsuXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlc291cmNlTGluayA9IGF3YWl0IHJlc291cmNlTGlua1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEF6dXJlIHJlc291cmNlIGdyb3VwIGxpbmsgOiA8YSBocmVmPSR7cmVzb3VyY2VMaW5rLnVyaX0gdGFyZ2V0PVwiX2JsYW5rXCI+JHtyZXNvdXJjZS5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRG9uZS5gKVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBlZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbFByZXZpZXcge1xyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFByZXZpZXcobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkueGwoKS5jZW50ZXIoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3Lm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsUHJldmlldztcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuYm9keSgpLnRleHQoJ0xvYWRpbmcgLi4uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyBFeHRyYWN0IGluZm8gZnJvbSBkYXRhLSogYXR0cmlidXRlc1xyXG4gICAgICAgIHZhciBlbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG4gICAgICAgIHZhciBkYXRhU291cmNlTmFtZSA9IGJ1dHRvbi5kYXRhKCdkYXRhLXNvdXJjZS1uYW1lJylcclxuICAgICAgICB2YXIgc2NoZW1hTmFtZSA9IGJ1dHRvbi5kYXRhKCdzY2hlbWEtbmFtZScpXHJcbiAgICAgICAgdmFyIHRhYmxlTmFtZSA9IGJ1dHRvbi5kYXRhKCd0YWJsZS1uYW1lJylcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcmV2aWV3Um93c1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvQXp1cmVTcWxEYXRhYmFzZS8ke2VuZ2luZUlkfS8ke2RhdGFTb3VyY2VOYW1lfS90YWJsZXMvJHtzY2hlbWFOYW1lfS8ke3RhYmxlTmFtZX0vcHJldmlld2ApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByZXZpZXdSb3dzUmVzcG9uc2Uuc3RhdHVzICE9IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZpZXdSb3dzID0gYXdhaXQgcHJldmlld1Jvd3NSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZpZXdSb3dzLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkuYXBwZW5kKFwiPHRhYmxlIGlkPSd0YWJsZSc+PC90YWJsZT5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cxID0gcHJldmlld1Jvd3NbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2x1bW5zID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbyBpbiByb3cxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI3RhYmxlJykuYm9vdHN0cmFwVGFibGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBwcmV2aWV3Um93c1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS50ZXh0KCdObyByb3dzLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIG5ldyBtb2RhbFBhbmVsRXJyb3IoXCJlcnJvclByZXZpZXdcIiwgZSkuc2hvdygpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbFVzZXJzIHtcclxuXHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IG1vZGFsUGFuZWxVc2Vycyhtb2RhbF9kYXRhX3RhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxfZGF0YV90YXJnZXQgPSBtb2RhbF9kYXRhX3RhcmdldDtcclxuICAgICAgICAvLyBHZXQgdGhlIHNtYWxsIG1vZGFsXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLnNtKCkuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbFVzZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS50ZXh0KCdMb2FkaW5nIC4uLicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuICAgICAgICB2YXIgdXNlcnNJZHNWYWwgPSBidXR0b24uZGF0YSgndXNlcnMtaWQnKSAvLyBFeHRyYWN0IGluZm8gZnJvbSBkYXRhLSogYXR0cmlidXRlc1xyXG5cclxuICAgICAgICBpZiAoIXVzZXJzSWRzVmFsIHx8IHVzZXJzSWRzVmFsID09PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLnRleHQoJ05vdGhpbmcgdG8gc2hvdy4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHVzZXJzSWRzID0gdXNlcnNJZHNWYWwuc3BsaXQoJywnKS5tYXAodiA9PiB2LnRyaW0oKSk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXNlcnNJZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPT09IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLmVtcHR5KCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdXNlcklkID0gdXNlcnNJZHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXVzZXJJZCB8fCB1c2VySWQgPT0gJycpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kYWxVc2Vycy5ib2R5KCkuYXBwZW5kKFxyXG4gICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdtLTMnIHN0eWxlPSdvdmVyZmxvdzphdXRvOyc+PG1ndC1wZXJzb24gdXNlci1pZD0nXCIgKyB1c2Vyc0lkc1tpXSArIFwiJyBmZXRjaC1pbWFnZT0ndHJ1ZScgcGVyc29uLWNhcmQ9J2hvdmVyJyB2aWV3PSd0d29MaW5lcyc+PC9tZ3QtcGVyc29uPjwvZGl2PlwiXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbEVycm9yIHtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0LCBlcnJvck1lc3NhZ2UpIHtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbF9kYXRhX3RhcmdldCA9IG1vZGFsX2RhdGFfdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gZXJyb3JNZXNzYWdlO1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvciA9IG5ldyBtb2RhbFBhbmVsKG1vZGFsX2RhdGFfdGFyZ2V0KS54bCgpLmNlbnRlcigpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3Iub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3Iub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxFcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5wYW5lbCgpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1BhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci50aXRsZSgpLnRleHQoXCJFcnJvclwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3IuYm9keSgpLnRleHQodGhpcy5lcnJvck1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG4gICAgfVxyXG5cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHtcclxuICAgIG1vZGFsUGFuZWxVc2VycyxcclxuICAgIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUsXHJcbiAgICBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cCxcclxuICAgIG1vZGFsUGFuZWxEYXRhYnJpY2tzLFxyXG4gICAgbW9kYWxQYW5lbERhdGFGYWN0b3J5XHJcbn0gZnJvbSBcIi4uL21vZGFsL2luZGV4LmpzXCI7XHJcblxyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uLmpzXCJcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGVuZ2luZURldGFpbHNQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE1lbWJlcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RNZW1iZXJzXCIpO1xyXG5cclxuICAgICAgICBtb2RhbFBhbmVsRGVsZXRlRW5naW5lLmluaXRpYWxpemUoXCJwYW5lbERlbGV0ZUVuZ2luZVwiKTtcclxuICAgICAgICBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cC5pbml0aWFsaXplKFwicGFuZWxSZXNvdXJjZUdyb3VwXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxEYXRhYnJpY2tzLmluaXRpYWxpemUoXCJwYW5lbERhdGFicmlja3NcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbERhdGFGYWN0b3J5LmluaXRpYWxpemUoXCJwYW5lbERhdGFGYWN0b3J5XCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gJChcIiNJZFwiKTtcclxuXHJcbiAgICAgICAgaWYgKCQoXCIjY29uc29sZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMiA9IG5ldyBjb25zb2xlMigkKFwiI2NvbnNvbGVcIiksICQoJ2Rpdi5kb2NraW5nLWZvcm0nKSk7XHJcblxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdGFydGVkLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5pZC52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24oXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95ZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vZmYoXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcbiIsIu+7v2V4cG9ydCBjbGFzcyBkb3RtaW10YWJsZSB7XHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHVybCwgdXJsQ291bnQsIHBhZ2VTaXplKSB7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy51cmxDb3VudCA9IHVybENvdW50ID8/IHRoaXMudXJsICsgXCIvY291bnRcIjtcclxuXHJcbiAgICAgICAgdGhpcy5zcGlubmVyID0gJCgnI3NwaW5uZXItJyArIG5hbWUpO1xyXG4gICAgICAgIHRoaXMuYm9keSA9ICQoJyN0Ym9keS0nICsgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91cyA9ICQoJyNwcmV2aW91cy0nICsgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5uZXh0ID0gJCgnI25leHQtJyArIG5hbWUpO1xyXG4gICAgICAgIHRoaXMucmVmcmVzaCA9ICQoJyNyZWZyZXNoLScgKyBuYW1lKTtcclxuXHJcbiAgICAgICAgLy8gZGlzYWJsZSBidXR0b25zXHJcbiAgICAgICAgdGhpcy5wcmV2aW91cy5wYXJlbnQoKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICB0aGlzLm5leHQucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblxyXG4gICAgICAgIC8vIGdldCBhIHBhZ2VcclxuICAgICAgICB0aGlzLnBhZ2VJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5pdGVtc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLnBhZ2VTaXplID0gcGFnZVNpemUgPz8gMjtcclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoLmNsaWNrKChldnQpID0+IHtcclxuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJldmlvdXMuY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleCAtIDE7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm5leHQuY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleCArIDE7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGxvYWQoKSB7XHJcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsICsgJz9wYWdlSW5kZXg9JyArIHRoaXMucGFnZUluZGV4ICsgJyZjb3VudD0nICsgdGhpcy5wYWdlU2l6ZTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGlubmVyLnNob3coKTtcclxuICAgICAgICAvL2xldCBkID0gYXdhaXQgJC5nZXRKU09OKHVybCk7XHJcblxyXG4gICAgICAgIHRoaXMuYm9keS5sb2FkKHVybCwgKGQsIHN0YXR1cywgeGhyKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZXJyb3JcIikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFkIHx8IGQudHJpbSgpID09ICcnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclJvd3MoJ05vIGRhdGEnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lci5oaWRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlRGlzYWJsZUJ1dHRvbnMoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIHRoaXMuc3Bpbm5lci5zaG93KCk7XHJcbiAgICAgICAgdGhpcy5jbGVhclJvd3MoKTtcclxuXHJcbiAgICAgICAgJC5nZXRKU09OKHRoaXMudXJsQ291bnQsIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zQ291bnQgPSBkYXRhLmNvdW50O1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcclxuICAgICAgICB9KS5mYWlsKChlcnJvcikgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGVycm9yU3RyaW5nID0gZXJyb3IucmVzcG9uc2VKU09OID8gKGVycm9yLnJlc3BvbnNlSlNPTi5lcnJvciA/PyBlcnJvci5yZXNwb25zZUpTT04pIDogZXJyb3IucmVzcG9uc2VUZXh0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRGaXJzdFJvd1dhcm5pbmcoZXJyb3JTdHJpbmcpO1xyXG4gICAgICAgICAgICB0aGlzLnNwaW5uZXIuaGlkZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZURpc2FibGVCdXR0b25zKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRmlyc3RSb3dXYXJuaW5nKHRleHQpIHtcclxuICAgICAgICB0aGlzLmJvZHkuY2hpbGRyZW4oJ3RyJykuYWRkQ2xhc3MoJ2JnLWRhbmdlcicpO1xyXG4gICAgICAgIHRoaXMuYm9keS5jaGlsZHJlbigndHInKS5jaGlsZHJlbigndGQnKS5hZGRDbGFzcygndGV4dC1saWdodCcpLmFwcGVuZCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclJvd3ModGV4dCkge1xyXG4gICAgICAgIGxldCBjb2x1bW5zQ291bnQgPSB0aGlzLmJvZHkucGFyZW50KCkuZmluZCgndGgnKS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKCFjb2x1bW5zQ291bnQpXHJcbiAgICAgICAgICAgIGNvbHVtbnNDb3VudCA9IHRoaXMuYm9keS5wYXJlbnQoKS5maW5kKCd0cicpLmxlbmd0aDtcclxuICAgICAgICBpZiAoIWNvbHVtbnNDb3VudClcclxuICAgICAgICAgICAgY29sdW1uc0NvdW50ID0gMTtcclxuXHJcbiAgICAgICAgdGV4dCA9IHRleHQgPz8gJyZuYnNwOyc7XHJcblxyXG4gICAgICAgIHRoaXMuYm9keS5odG1sKCc8dHI+PHRkIGNvbHNwYW49JyArIGNvbHVtbnNDb3VudCArICc+JyArIHRleHQgKyAnPC90ZD48L3RyPicpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBlbmFibGVEaXNhYmxlQnV0dG9ucygpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFnZUluZGV4IDw9IDApXHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXMucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cclxuICAgICAgICBpZiAoKHRoaXMucGFnZUluZGV4ICsgMSkgKiB0aGlzLnBhZ2VTaXplID49IHRoaXMuaXRlbXNDb3VudClcclxuICAgICAgICAgICAgdGhpcy5uZXh0LnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5uZXh0LnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cclxuICAgIH1cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi9yb3V0ZXIuanNcIjtcclxuaW1wb3J0IHsgZG90bWltdGFibGUgfSBmcm9tIFwiLi4vZG90bWltdGFibGUuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGFkbWluUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBkZWxheSB9IGZyb20gXCIuLi9oZWxwZXJzLmpzXCJcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIjtcclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiXHJcbmltcG9ydCB7IG1vZGFsUGFuZWxVc2VycyB9IGZyb20gXCIuLi9tb2RhbC9tb2RhbFBhbmVsVXNlcnMuanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBhZG1pbkRlcGxveW1lbnRFbmdpbmVQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuXHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRNZW1iZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0T3duZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0TWVtYmVyc1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9ICQoXCIjRW5naW5lVmlld19JZFwiKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUyID0gbmV3IGNvbnNvbGUyKCQoXCIjY29uc29sZVwiKSwgJCgnZGl2LmRvY2tpbmctZm9ybScpKTtcclxuICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbiA9ICQoJyNsYXVuY2gnKTtcclxuICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaWQgfHwgIXRoaXMuaWQudmFsKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKFwiQ2FuJ3QgbGF1bmNoIGRlcGxveW1lbnQuIE5vIGVuZ2luZSByZXF1ZXN0IC4uLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzdWJzY3JpYmUgdG8gZXZlbnQgZnJvbSBzaWduYWxyIGFib3V0IGRlcGxveW1lbnRcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RhcnRlZCwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5pZC52YWwoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIHN0YXJ0ZWQuXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJSZWFkeSB0byBkZXBsb3kuXCIpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXHJcbiAgICAgICAgICAgIHRoaXMubGF1bmNoQnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0aW5nLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0aW5nLi4uXCIpKTtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0ZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RlZC4uLlwiKSk7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RvcHBlZCwgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgc3RvcHBlZC5cIikpO1xyXG5cclxuICAgICAgICAvLyBKdXN0IGluIGNhc2UgaXQncyBub3Qgc3RhcnRlZCAoYnV0IHNob3VsZCBiZSBkb25lIGFscmVhZHkgZnJvbSBob21lUGFnZS5qcylcclxuICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5zdGFydCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbi5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gTGF1bmNoIGEgdmFsaWRhdGlvbiBiZWZvcmVcclxuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSAkKFwiZm9ybVwiKS52YWxpZCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5sYXVuY2hKb2JBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGxhdW5jaEpvYkFzeW5jKCkge1xyXG4gICAgICAgIHRoaXMuY29uc29sZTIuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiRGVwbG95bWVudCBzdGFydGVkLlwiKVxyXG4gICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pZCB8fCAhdGhpcy5pZC52YWwoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZFdhcm5pbmcoXCJDYW4ndCBsYXVuY2ggZGVwbG95bWVudC4gTm8gZW5naW5lIHJlcXVlc3QgLi4uXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIlNhdmluZyBkZXBsb3ltZW50IHByb3BlcnRpZXMuLi5cIik7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIEZpcnN0LCBzYXZlIHRoZSBkZXBsb3ltZW50LlxyXG4gICAgICAgICAgICBhd2FpdCAkLnBvc3QoJycsICQoJ2Zvcm0nKS5zZXJpYWxpemUoKSk7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihgVW5hYmxlIHRvIHNhdmUgZW5naW5lIGRldGFpbHNgKTtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QoZS5yZXNwb25zZUpTT04pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJXYWl0aW5nIGZvciBhbiBhZ2VudCB0byBlbnF1ZXVlIHRoZSBkZXBsb3ltZW50Li4uXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gdXJsIGZvciB0aGF0IHBhcnRpY3VsYXIgZGVwbG95bWVudFxyXG4gICAgICAgICAgICBsZXQgdXJsID0gYC9hcGkvZW5naW5lcy8ke3RoaXMuaWQudmFsKCl9L2RlcGxveWA7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihgPGI+RGVwbG95bWVudDwvYj4gJHt0aGlzLmlkLnZhbCgpfSBjYW4gbm90IGJlIGRlcGxveWVkLi4uYCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3JKc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNvbnNvbGUyLmFwcGVuZE9iamVjdChlcnJvckpzb24pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgZGVwbG95bWVudHN0YXJ0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95bWVudHN0YXJ0KVxyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kRXJyb3IoYFVuYWJsZSB0byBkZXBsb3kgZW5naW5lYCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KGUucmVzcG9uc2VKU09OKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95ZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uVW5sb2FkKCkge1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9mZihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQge1xyXG4gICAgbW9kYWxQYW5lbFVzZXJzLFxyXG4gICAgbW9kYWxQYW5lbERlbGV0ZUVuZ2luZSxcclxuICAgIG1vZGFsUGFuZWxSZXNvdXJjZUdyb3VwLFxyXG4gICAgbW9kYWxQYW5lbERhdGFicmlja3MsXHJcbiAgICBtb2RhbFBhbmVsRGF0YUZhY3RvcnlcclxufSBmcm9tIFwiLi4vbW9kYWwvaW5kZXguanNcIjtcclxuXHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuLi9ub3RpZmljYXRpb24uanNcIlxyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgYWRtaW5FbmdpbmVSZXF1ZXN0RGV0YWlsc1BhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxEZXBsb3ltZW50T3duZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxEZXBsb3ltZW50TWVtYmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsUmVxdWVzdE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsUmVxdWVzdE1lbWJlcnNcIik7XHJcblxyXG4gICAgICAgIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUuaW5pdGlhbGl6ZShcInBhbmVsRGVsZXRlRW5naW5lXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxSZXNvdXJjZUdyb3VwLmluaXRpYWxpemUoXCJwYW5lbFJlc291cmNlR3JvdXBcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbERhdGFicmlja3MuaW5pdGlhbGl6ZShcInBhbmVsRGF0YWJyaWNrc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsRGF0YUZhY3RvcnkuaW5pdGlhbGl6ZShcInBhbmVsRGF0YUZhY3RvcnlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSAkKFwiI0lkXCIpO1xyXG5cclxuICAgICAgICBpZiAoJChcIiNjb25zb2xlXCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyID0gbmV3IGNvbnNvbGUyKCQoXCIjY29uc29sZVwiKSwgJCgnZGl2LmRvY2tpbmctZm9ybScpKTtcclxuXHJcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IG5vdGlmaWNhdGlvbi5jdXJyZW50LmNvbm5lY3Rpb24uaW52b2tlKCdTdWJzY3JpYmVEZXBsb3ltZW50QXN5bmMnLCB0aGlzLmlkLnZhbCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95ZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vZmYoXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCLvu79cblxuZXhwb3J0IGNsYXNzIG1ndGxvYWRlciB7XG5cclxuXG4gICAgc3RhdGljIHNldE1ndFByb3ZpZGVyKCkge1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IG5ldyBtZ3QuUHJveHlQcm92aWRlcihcIi9hcGkvUHJveHlcIik7XG4gICAgICAgIHByb3ZpZGVyLmxvZ2luID0gKCkgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0FjY291bnQvU2lnbkluP3JlZGlyZWN0VXJpPScgKyB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgcHJvdmlkZXIubG9nb3V0ID0gKCkgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL01pY3Jvc29mdElkZW50aXR5L0FjY291bnQvU2lnbk91dCc7XG5cbiAgICAgICAgbWd0LlByb3ZpZGVycy5nbG9iYWxQcm92aWRlciA9IHByb3ZpZGVyO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbnRlcmNlcHRNZ3RMb2dpbigpIHtcbiAgICAgICAgdmFyIG1ndGxvZ2luID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21ndGxvZ2luJyk7XG5cbiAgICAgICAgLy8vLyBUaGVzZXMgZXZlbnRzIGFyZSByYWlzZWQgd2hlbiB1c2VyIGNsaWNrIG9uIGxvZ2luIG91ciBsb2dvdXQgYnV0dG9uXG4gICAgICAgIC8vLy8gVGhleXIgYXJlIG5vdCByYWlzZWQgYXQgdGhlIGdvb2QgdGltaW5nXG4gICAgICAgIC8vLy8gU2hvdWxkIGJlIHJlbmFtZWQgJ2xvZ2luQ2xpY2snIGFuZCAnbG9nb3V0Q2xpY2snXG4gICAgICAgIC8vbWd0bG9naW4uYWRkRXZlbnRMaXN0ZW5lcignbG9naW5Db21wbGV0ZWQnLCAoKSA9PiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInVzZXJkZXRhaWxzXCIpKTtcbiAgICAgICAgLy9tZ3Rsb2dpbi5hZGRFdmVudExpc3RlbmVyKCdsb2dvdXRDb21wbGV0ZWQnLCAoKSA9PiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInVzZXJkZXRhaWxzXCIpKTtcblxuICAgICAgICAvLy8vIGdldCBsb2NhbCBzdG9yYWdlIGl0ZW0gaWYgYW55XG4gICAgICAgIC8vdmFyIHVzZXJEZXRhaWxzRnJvbVN0b3JhZ2VTdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcmRldGFpbHMnKTtcblxuICAgICAgICAvL2lmICh1c2VyRGV0YWlsc0Zyb21TdG9yYWdlU3RyaW5nICE9PSBudWxsICYmIG1ndGxvZ2luLnVzZXJEZXRhaWxzID09PSBudWxsKVxuICAgICAgICAvLyAgICBtZ3Rsb2dpbi51c2VyRGV0YWlscyA9IEpTT04ucGFyc2UodXNlckRldGFpbHNGcm9tU3RvcmFnZVN0cmluZyk7XG5cbiAgICAgICAgLy8vLyBMb2FkaW5nIGNvbXBsZXRlZCBpcyBjb3JyZWN0bHkgZmlyZWQgQUZURVIgY29tcG9uZW50IGlzIGxvYWRlZCBBTkQgdXNlciBsb2dnZWQgaW5cbiAgICAgICAgLy9tZ3Rsb2dpbi5hZGRFdmVudExpc3RlbmVyKCdsb2FkaW5nQ29tcGxldGVkJywgKCkgPT4ge1xuICAgICAgICAvLyAgICBpZiAobWd0bG9naW4udXNlckRldGFpbHMgIT09IG51bGwpXG4gICAgICAgIC8vICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcmRldGFpbHMnLCBKU09OLnN0cmluZ2lmeShtZ3Rsb2dpbi51c2VyRGV0YWlscykpO1xuICAgICAgICAvL30pO1xuXG4gICAgfVxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBoYW5kbGVycyB9IGZyb20gXCIuL2hhbmRsZXJzLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBhdXRoIHtcclxuXHJcblxyXG5cdC8vIHNpbmdsZXRvblxyXG5cdHN0YXRpYyBfY3VycmVudDtcclxuXHJcblx0LyoqIEByZXR1cm5zIHthdXRofSAqL1xyXG5cdHN0YXRpYyBnZXQgY3VycmVudCgpIHtcclxuXHRcdGlmICghYXV0aC5fY3VycmVudClcclxuXHRcdFx0YXV0aC5fY3VycmVudCA9IG5ldyBhdXRoKCk7XHJcblxyXG5cdFx0cmV0dXJuIGF1dGguX2N1cnJlbnQ7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgT25BdXRoZW50aWNhdGVkID0gXCJPbkF1dGhlbnRpY2F0ZWRcIlxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuaGFuZGxlcnMgPSBuZXcgaGFuZGxlcnMoKTtcclxuXHJcblx0XHQvKiogQHR5cGUgYm9vbGVhbiAqL1xyXG5cdFx0dGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBnbG9iYWxVc2VyQXV0aGVudGljYXRlZDtcclxuXHR9XHJcblxyXG5cdGluaXRpYWxpemUoKSB7XHJcblxyXG5cdFx0JCgoKSA9PiB7XHJcblx0XHRcdC8vIGludm9rZSBhbGwgaGFuZGxlcnMgdG8gT25BdXRoZW50aWNhdGVkIHdpdGggdGhlIGNvcnJlY3QgdmFsdWVcclxuXHRcdFx0dGhpcy5oYW5kbGVycy5pbnZva2UoYXV0aC5PbkF1dGhlbnRpY2F0ZWQsIHRoaXMuaXNBdXRoZW50aWNhdGVkLCAnY29vbCcpXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdG9uKG1ldGhvZE5hbWUsIG5ld01ldGhvZCkge1xyXG5cdFx0dGhpcy5oYW5kbGVycy5vbihtZXRob2ROYW1lLCBuZXdNZXRob2QpO1xyXG5cdH1cclxuXHJcblx0b2ZmKG1ldGhvZE5hbWUsIG1ldGhvZCkge1xyXG5cdFx0dGhpcy5oYW5kbGVycy5vZmYobWV0aG9kTmFtZSwgbWV0aG9kKTtcclxuXHR9XHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi4vbW9kYWwvbW9kYWxQYW5lbC5qc1wiO1xyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uLmpzXCI7XHJcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi4vYXV0aC5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgaG9tZVBhZ2Uge1xyXG5cclxuICAgIC8vIHNpbmdsZXRvblxyXG4gICAgc3RhdGljIF9jdXJyZW50O1xyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7aG9tZVBhZ2V9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGN1cnJlbnQoKSB7XHJcbiAgICAgICAgaWYgKCFob21lUGFnZS5fY3VycmVudClcclxuICAgICAgICAgICAgaG9tZVBhZ2UuX2N1cnJlbnQgPSBuZXcgaG9tZVBhZ2UoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhvbWVQYWdlLl9jdXJyZW50O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG4gICAgICAgICQoYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5vbkxvYWQoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIG5vdGlmaWNhdGlvbiBtb2RhbFxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbCA9IG5ldyBtb2RhbFBhbmVsKFwibm90aWZcIikuc20oKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBhdXRvIGJpbmQgd2l0aCBhcnJvdyBmdW5jdGlvblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICAvLyBtYW51YWwgYmluZGluZyBmb3IgZnVuXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLm9uU2hvdyh0aGlzLnNob3dQYW5lbC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsID0gbmV3IG1vZGFsUGFuZWwoXCJzZXR0aW5nc1wiKS5sZygpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC5vblNob3duKGUgPT4gdGhpcy5zaG93blNldHRpbmdzUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkU2V0dGluZ3NQYW5lbChlKSk7XHJcblxyXG5cclxuICAgICAgICAvL25vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IGF3YWl0IGNvbnNvbGUubG9nKFwiQmFja2VuZCBzZXJ2ZXIgc3RhcnRlZC5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZywgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0aW5nLi4uXCIpKTtcclxuICAgICAgICAvL25vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RvcHBlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBzdG9wcGVkLlwiKSk7XHJcblxyXG4gICAgICAgIC8vIHdoZW4gcmVjZWl2aW5nIGFuIG9yZGVyIHRvIHJlZnJlc2ggbm90aWZpY2F0aW9uc1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKCdyZWZyZXNoX25vdGlmaWNhdGlvbnMnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbCB0byByZWZyZXNoX25vdGlmaWNhdGlvbnNcIik7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5zdGFydCgpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGF1dGguY3VycmVudC5pc0F1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwic2V0dGluZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGgtbGFyZ2VcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFib3V0ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlNvbWV0aGluZyBpbnRlcmVzdGluZyBsaWtlLi4uIEhleSwgdGhpcyBpcyBhIHBpZWNlIG9mIE9TUyBwcm9qZWN0LCBtYWRlIGJ5IFNlYmFzdGllbiBQZXJ0dXM8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY29nc1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdCBFbmdpbmUgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPiAgXHJcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cIm10LTJcIiBkYXRhLXN0eWxlPVwiYnRuLW91dGxpbmUtZGFya1wiIGRhdGEtY29udGFpbmVyPVwiYm9keVwiIGRhdGEtbGl2ZS1zZWFyY2g9XCJ0cnVlXCIgdGl0bGU9XCJDaG9vc2UgZGVmYXVsdCBlbmdpbmVcIiBpZD1cImRlZmF1bHRFbmdpbmVTZWxlY3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5NdXN0YXJkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+S2V0Y2h1cDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlJlbGlzaDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgYCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjZGVmYXVsdEVuZ2luZVNlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuIFxyXG5cclxuICAgICAgICBhdXRoLmN1cnJlbnQub24oYXV0aC5PbkF1dGhlbnRpY2F0ZWQsIGFzeW5jIGlzQXV0aCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc0F1dGgpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hOb3RpZmljYXRpb25zQXN5bmMoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZGlzbWlzc05vdGlmaWNhdGlvbnNBc3luYygpIHtcclxuXHJcbiAgICAgICAgLy8gbG9hZGluZyBub3RpZmljYXRpb25zXHJcbiAgICAgICAgbGV0IHVybCA9IFwiL2FwaS9ub3RpZmljYXRpb25zXCI7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1ldGhvZDogXCJERUxFVEVcIiB9KTtcclxuXHJcbiAgICAgICAgdmFyIGRlbGV0ZWQgPSByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIGlmICghZGVsZXRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlZnJlc2hOb3RpZmljYXRpb25zQXN5bmMoKSB7XHJcblxyXG4gICAgICAgIC8vIGxvYWRpbmcgbm90aWZpY2F0aW9uc1xyXG4gICAgICAgIGxldCB1cmwgPSBcIi9hcGkvbm90aWZpY2F0aW9uc1wiO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmJvZHkoKS5lbXB0eSgpO1xyXG5cclxuICAgICAgICBsZXQgYmVsbENvbnRlbnQgPSAkKCcjbm90aWYtYmVsbC1jb250ZW50Jyk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5ub3RpZmljYXRpb25zIHx8IHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPD0gMCkge1xyXG5cclxuICAgICAgICAgICAgYmVsbENvbnRlbnQuaGlkZSgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMubm90aWZNb2RhbC5ib2R5KCkuYXBwZW5kKGBcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmLWVtcHR5LWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFyIGZhLWJlbGxcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+Tm8gbmV3IG5vdGlmaWNhdGlvbnMsIHlldC48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PmApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgYmVsbENvbnRlbnQuc2hvdygpO1xyXG4gICAgICAgICAgICBiZWxsQ29udGVudC50ZXh0KHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGgudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBub3RpZiBvZiB0aGlzLm5vdGlmaWNhdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbm90aWZVcmwgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmIChub3RpZi51cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgbm90aWZVcmwgPSBgPGEgaHJlZj1cIiR7bm90aWYudXJsfVwiIGNsYXNzPVwibWwtMiBoaWRlLXNtXCI+PGkgY2xhc3M9XCJmYXMgZmEtZXh0ZXJuYWwtbGluay1hbHRcIj48L2k+PC9hPmA7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrLWNpcmNsZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7bm90aWYudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmLW1lc3NhZ2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7bm90aWYubWVzc2FnZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke25vdGlmVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2RpdiA+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXYgPiBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG4gICAgICAgIHZhciB0eXBlID0gYnV0dG9uLmRhdGEoJ3R5cGUnKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93blNldHRpbmdzUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkU2V0dGluZ3NQYW5lbChldmVudCkge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgc2hvd1BhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmRlbGV0ZUJ1dHRvblRleHQoXCJEaXNtaXNzIG5vdGlmaWNhdGlvbnNcIik7XHJcblxyXG4gICAgICAgIGlmICghYXV0aC5jdXJyZW50LmlzQXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmFwcGVuZChgXHJcbiAgICAgICAgICAgICAgICAgICAgPCBkaXYgY2xhc3M9IFwibm90aWYtZW1wdHlcIiA+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmLWVtcHR5LWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXIgZmEtYmVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5QbGVhc2UgbG9nIGluIHRvIHNlZSBub3RpZmljYXRpb25zIGhlcmUuPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2ID4gYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuZGVsZXRlQnV0dG9uKCkuY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5kaXNtaXNzTm90aWZpY2F0aW9uc0FzeW5jKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgY2xhc3Mgc2V0dGluZ3NQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwi77u/ZXhwb3J0IGZ1bmN0aW9uIHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlKCRlbmdpbmVzVGFibGUsIHVybCwgY2hlY2tlZCwgb25Qb3N0Qm9keSwgb25DaGVja1Jvdykge1xyXG5cclxuXHJcbiAgICBsZXQgb25DaGVjayA9IGNoZWNrZWQgPyBvbkNoZWNrUm93IDogKCkgPT4geyB9O1xyXG4gICAgbGV0IG9uQ2xpY2sgPSBjaGVja2VkID8gKCkgPT4geyB9OiBvbkNoZWNrUm93O1xyXG5cclxuICAgIGxldCBjb2x1bW5zID0gW107XHJcbiAgICBpZiAoY2hlY2tlZClcclxuICAgICAgICBjb2x1bW5zLnB1c2goe1xyXG4gICAgICAgICAgICBmaWVsZDogJ2VuZ2luZUlkJyxcclxuICAgICAgICAgICAgcmFkaW86IHRydWUsXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICBjb2x1bW5zLnB1c2goe1xyXG4gICAgICAgIGZpZWxkOiAnZW5naW5lVHlwZUpzb24nLFxyXG4gICAgICAgIHRpdGxlOiAnVHlwZScsXHJcbiAgICAgICAgd2lkdGg6ICc4MCcsXHJcbiAgICAgICAgYWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgIHNlYXJjaEZvcm1hdHRlcjogZmFsc2UsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIHJvdykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9J3N2Zy0yMngyMi1pY29uJz48ZGl2IGNsYXNzPSdzdmctaWNvbiAke3ZhbHVlLmVuZ2luZVR5cGVJY29uU3RyaW5nfSc+PC9kaXY+PC9kaXY+YDtcclxuICAgICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgICAgZmllbGQ6ICdzdGF0dXNKc29uJyxcclxuICAgICAgICB0aXRsZTogJ1N0YXR1cycsXHJcbiAgICAgICAgd2lkdGg6ICc4MCcsXHJcbiAgICAgICAgYWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgIHNlYXJjaEZvcm1hdHRlcjogZmFsc2UsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIHJvdykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYDxpIGNsYXNzPVwiJHt2YWx1ZS5zdGF0dXNJY29ufVwiIHRpdGxlPScke3ZhbHVlLnN0YXR1c1N0cmluZ30nIHN0eWxlPVwiY29sb3I6JHt2YWx1ZS5zdGF0dXNDb2xvcn07d2lkdGg6MjBweDtcIj48L2k+YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwge1xyXG4gICAgICAgIGZpZWxkOiAnZW5naW5lTmFtZScsXHJcbiAgICAgICAgdGl0bGU6ICdOYW1lJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgcm93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPHN0cm9uZz4ke3ZhbHVlfTwvc3Ryb25nPmA7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgc2VhcmNoOiBmYWxzZSxcclxuICAgICAgICBzaG93UmVmcmVzaDogZmFsc2UsXHJcbiAgICAgICAgc2hvd1RvZ2dsZTogZmFsc2UsXHJcbiAgICAgICAgY2hlY2tib3hIZWFkZXI6IGZhbHNlLFxyXG4gICAgICAgIGNsaWNrVG9TZWxlY3Q6IHRydWUsXHJcbiAgICAgICAgcGFnaW5hdGlvbjogZmFsc2UsXHJcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmdUZW1wbGF0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gJzxpIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluIGZhLWZ3IGZhLTJ4XCI+PC9pPic7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxyXG4gICAgICAgIG9uUG9zdEJvZHk6IG9uUG9zdEJvZHksXHJcbiAgICAgICAgb25DaGVjazogb25DaGVjayxcclxuICAgICAgICBvbkNsaWNrUm93OiBvbkNsaWNrLFxyXG4gICAgICAgIGZvcm1hdE5vTWF0Y2hlczogKCkgPT4geyByZXR1cm4gXCJZb3UgZG9uJ3QgaGF2ZSBhbnkgcnVubmluZyBlbmdpbmUuIFBsZWFzZSA8YSBocmVmPScvRW5naW5lcy9JbmRleCc+Y2hlY2sgeW91ciBlbmdpbmVzIHN0YXR1cy48L2E+IFwiOyB9XHJcbiAgICB9KTtcclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZGF0YVNvdXJjZXNQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICAvLyBnZXQgdGFibGVcclxuICAgICAgICB0aGlzLmVuZ2luZXNUYWJsZSA9ICQoXCIjZW5naW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgZW5naW5lIHRhYmxlXHJcbiAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlID0gJChcIiNlbmdpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlKHRoaXMuJGVuZ2luZXNUYWJsZSwgXCIvZGF0YVNvdXJjZXMvaW5kZXgvZW5naW5lc1wiLCB0cnVlLFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gdGhpcy5vblBvc3RCb2R5KGRhdGEpLFxyXG4gICAgICAgICAgICAocm93KSA9PiB0aGlzLm9uQ2xpY2tSb3cocm93KSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZSA9ICQoXCIjZGF0YVNvdXJjZXNUYWJsZVwiKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUuYm9vdHN0cmFwVGFibGUoe1xyXG4gICAgICAgICAgICBmb3JtYXROb01hdGNoZXM6ICgpID0+IHsgcmV0dXJuICdQbGVhc2Ugc2VsZWN0IGEgcnVubmluZyBlbmdpbmUgdG8gc2VlIGFsbCBkYXRhIHNvdXJjZXMgYXZhaWxhYmxlLic7IH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLm9uKCdjbGljay1yb3cuYnMudGFibGUnLCAocm93LCAkZWxlbWVudCwgZmllbGQpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgL0RhdGFTb3VyY2VzL0VkaXQvJHt0aGlzLmVuZ2luZS5pZH0vJHskZWxlbWVudC5uYW1lfWA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Qb3N0Qm9keShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZSA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnY2hlY2snLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25DbGlja1Jvdyhyb3cpIHtcclxuXHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSByb3c7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkRGF0YVNvdXJjZXNBc3luYyh0aGlzLmVuZ2luZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGxvYWREYXRhU291cmNlc0FzeW5jKGVuZ2luZSkge1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3Nob3dMb2FkaW5nJyk7XHJcbiAgICAgICAgbGV0IGRhdGFfdXJsID0gYC9kYXRhU291cmNlcy9pbmRleC9kYXRhU291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZS5pZH1gO1xyXG4gICAgICAgIGxldCBkYXRhU291cmNlc1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goZGF0YV91cmwpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSBhd2FpdCBkYXRhU291cmNlc1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRhdGFTb3VyY2VzKVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFTb3VyY2VzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSgndXBkYXRlRm9ybWF0VGV4dCcsICdmb3JtYXROb01hdGNoZXMnLFxyXG4gICAgICAgICAgICBgTm8gZGF0YSBzb3VyY2VzIGZvciBlbmdpbmUgPHN0cm9uZz4ke2VuZ2luZS5lbmdpbmVOYW1lfTwvc3Ryb25nPi4gPGEgaHJlZj0nL2RhdGFTb3VyY2VzL25ldyc+Q3JlYXRlIGEgbmV3IGRhdGEgc291cmNlPC9hPiBmb3IgeW91ciBlbmdpbmVgKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdsb2FkJywgdGhpcy5kYXRhU291cmNlcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnaGlkZUxvYWRpbmcnKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25VbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlIH0gZnJvbSBcIi4uL2Jvb3RzdHJhcFRhYmxlcy9pbmRleC5qc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIHdpemFyZFBhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGh0bWxGaWVsZFByZWZpeCwgZW5naW5lVXJsKSB7XHJcblxyXG4gICAgICAgIC8vIEh0bWxGaWVsZFByZWZpeCBwcmVmaXggaXMgdGhlIHByZWRpeCBmb3IgcmVuZGVyaW5nIGFzcC5uZXQgY29yZSBpdGVtc1xyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gYCR7aHRtbEZpZWxkUHJlZml4fV9gO1xyXG5cclxuICAgICAgICAvLyB1cmwgZm9yIGxvYWRpbmcgZW5naW5lc1xyXG4gICAgICAgIHRoaXMuZW5naW5lVXJsID0gZW5naW5lVXJsO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICAvLyBnZXQgZm9ybVxyXG4gICAgICAgIHRoaXMuJGZvcm0gPSAkKFwiZm9ybVwiKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IGVuZ2luZSB0YWJsZVxyXG4gICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZSA9ICQoXCIjZW5naW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgc3Bpbm5lclxyXG4gICAgICAgIHRoaXMuJHNwaW5uZXIgPSAkKFwiI3NwaW5uZXJcIilcclxuXHJcbiAgICAgICAgLy8gZ2V0IGJ1dHRvbnNcclxuICAgICAgICB0aGlzLiRuZXh0QnV0dG9uID0gJChcIiNuZXh0QnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMuJHByZXZpb3VzQnV0dG9uID0gJChcIiNwcmV2aW91c0J1dHRvblwiKTtcclxuICAgICAgICB0aGlzLiRzYXZlQnV0dG9uID0gJChcIiNzYXZlQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgd2l6YXJkXHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQgPSAkKFwiI3NtYXJ0V2l6YXJkXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgcHJvcGVydGllcyBwYW5lbFxyXG4gICAgICAgIHRoaXMuJHByb3BlcnRpZXMgPSAkKFwiI3Byb3BlcnRpZXNcIik7XHJcblxyXG4gICAgICAgIC8vIGhpZGRlbiBmaWVsZHNcclxuICAgICAgICB0aGlzLiRlbmdpbmVJZEVsZW1lbnQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1FbmdpbmVJZGApO1xyXG4gICAgICAgIHRoaXMuJGlzTmV3ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9SXNOZXdgKTtcclxuXHJcbiAgICAgICAgLy8gTm8gcHJlZml4IGZvciBoaWRkZW50IFN0ZXAgZmllbGQsIHNpbmNlIGl0J3MgZGlyZWN0bHkgYmluZGVkIGludG8gdGhlIFBhZ2VNb2RlbFxyXG4gICAgICAgIHRoaXMuJHN0ZXAgPSAkKGAjU3RlcGApO1xyXG5cclxuICAgICAgICB0aGlzLnN0ZXAgPSB0aGlzLiRzdGVwICAmJiB0aGlzLiRzdGVwLnZhbCgpID8gcGFyc2VJbnQodGhpcy4kc3RlcC52YWwoKSkgOiAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kc3Bpbm5lcilcclxuICAgICAgICAgICAgdGhpcy4kc3Bpbm5lci5oaWRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYm9vc3RyYXBFbmdpbmVzVGFibGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib290c3RyYXBXaXphcmQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib290c3RyYXBCdXR0b25zKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGJvb3RzdHJhcFdpemFyZCgpIHtcclxuXHJcbiAgICAgICAgLy8gU3RlcCBzaG93IGV2ZW50XHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQub24oXCJzaG93U3RlcFwiLCBhc3luYyAoZSwgYW5jaG9yT2JqZWN0LCBzdGVwTnVtYmVyLCBzdGVwRGlyZWN0aW9uLCBzdGVwUG9zaXRpb24pID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBzdGVwXHJcbiAgICAgICAgICAgIHRoaXMuJHN0ZXAudmFsKHN0ZXBOdW1iZXIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy4kcHJldmlvdXNCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJHNhdmVCdXR0b24uZGlzYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0ZXBQb3NpdGlvbiA9PT0gXCJmaXJzdFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSBcImxhc3RcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzYXZlQnV0dG9uLmVuYWJsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gYm9vdHN0cmFwIHdpemFyZFxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IHRoaXMuc3RlcCxcclxuICAgICAgICAgICAgdGhlbWU6ICdkb3RzJywgLy8gdGhlbWUgZm9yIHRoZSB3aXphcmQsIHJlbGF0ZWQgY3NzIG5lZWQgdG8gaW5jbHVkZSBmb3Igb3RoZXIgdGhhbiBkZWZhdWx0IHRoZW1lXHJcbiAgICAgICAgICAgIGF1dG9BZGp1c3RIZWlnaHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdmYWRlJywgLy8gRWZmZWN0IG9uIG5hdmlnYXRpb24sIG5vbmUvZmFkZS9zbGlkZS1ob3Jpem9udGFsL3NsaWRlLXZlcnRpY2FsL3NsaWRlLXN3aW5nXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJzIwMCcsIC8vIFRyYW5zaW9uIGFuaW1hdGlvbiBzcGVlZFxyXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnJyAvLyBUcmFuc2l0aW9uIGFuaW1hdGlvbiBlYXNpbmcuIE5vdCBzdXBwb3J0ZWQgd2l0aG91dCBhIGpRdWVyeSBlYXNpbmcgcGx1Z2luXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVuYWJsZVVSTGhhc2g6IGZhbHNlLFxyXG4gICAgICAgICAgICB0b29sYmFyU2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJQb3NpdGlvbjogJ25vbmUnLCAvLyBub25lLCB0b3AsIGJvdHRvbSwgYm90aFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvblBvc2l0aW9uOiAncmlnaHQnLCAvLyBsZWZ0LCByaWdodCwgY2VudGVyXHJcbiAgICAgICAgICAgICAgICBzaG93TmV4dEJ1dHRvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBhIE5leHQgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICBzaG93UHJldmlvdXNCdXR0b246IGZhbHNlLCAvLyBzaG93L2hpZGUgYSBQcmV2aW91cyBidXR0b25cclxuICAgICAgICAgICAgICAgIHRvb2xiYXJFeHRyYUJ1dHRvbnM6IFtdIC8vIEV4dHJhIGJ1dHRvbnMgdG8gc2hvdyBvbiB0b29sYmFyLCBhcnJheSBvZiBqUXVlcnkgaW5wdXQvYnV0dG9ucyBlbGVtZW50c1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBrZXlib2FyZFNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICBrZXlOYXZpZ2F0aW9uOiBmYWxzZSwgLy8gRW5hYmxlL0Rpc2FibGUga2V5Ym9hcmQgbmF2aWdhdGlvbihsZWZ0IGFuZCByaWdodCBrZXlzIGFyZSB1c2VkIGlmIGVuYWJsZWQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBlbmdpbmVUYWJsZU9uQ2hlY2tSb3cocm93LCAkZWxlbWVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLiRlbmdpbmVJZEVsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwocm93LmlkKTtcclxuXHJcbiAgICB9XHJcbiAgICBhc3luYyBlbmdpbmVUYWJsZU9uUG9zdEJvZHkoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoIWRhdGE/Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0QnV0dG9uLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGVuZ2luZUlkRWxlbWVudCAmJiB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZEluZGV4ID0gZGF0YS5maW5kSW5kZXgoZSA9PiBlLmlkID09PSB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPj0gMClcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnY2hlY2snLCBzZWxlY3RlZEluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgcmFkaW8gaW5wdXRzIGJ1dHRvbnMgdG8gYWRkIGEgdmFsaWRhdGlvbiBydWxlIG9uIHRoZW1cclxuICAgICAgICBsZXQgJGJ0U2VsZWN0SXRlbSA9ICQoJ2lucHV0W25hbWU9XCJidFNlbGVjdEl0ZW1cIl0nKTtcclxuXHJcbiAgICAgICAgJGJ0U2VsZWN0SXRlbS5ydWxlcyhcImFkZFwiLCB7XHJcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwiWW91IHNob3VsZCBzZWxlY3QgYW4gZW5naW5lIGJlZm9yZSBnb2luZyBuZXh0IHN0ZXAuXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYm9vc3RyYXBFbmdpbmVzVGFibGUoKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZW5naW5lc1RhYmxlIHx8ICF0aGlzLmVuZ2luZVVybClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSh0aGlzLiRlbmdpbmVzVGFibGUsIHRoaXMuZW5naW5lVXJsLCB0cnVlLFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gdGhpcy5lbmdpbmVUYWJsZU9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3csICRlbGVtZW50KSA9PiB0aGlzLmVuZ2luZVRhYmxlT25DaGVja1Jvdyhyb3csICRlbGVtZW50KSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJvb3RzdHJhcEJ1dHRvbnMoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRwcmV2aW91c0J1dHRvbikge1xyXG4gICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5jbGljaygoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwicHJldlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRuZXh0QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlRm9ybSgpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcIm5leHRcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YWxpZGF0ZUZvcm0oKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZm9ybSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGxldCBpc1ZhbGlkID0gdGhpcy4kZm9ybS52YWxpZCgpO1xyXG5cclxuICAgICAgICBpZiAoIWlzVmFsaWQpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHZhbGlkYXRvciA9IHRoaXMuJGZvcm0udmFsaWRhdGUoKTtcclxuICAgICAgICB2YWxpZGF0b3IucmVzZXRGb3JtKCk7XHJcblxyXG4gICAgICAgIGxldCBzdW1tYXJ5ID0gdGhpcy4kZm9ybS5maW5kKFwiLnZhbGlkYXRpb24tc3VtbWFyeS1lcnJvcnNcIik7XHJcblxyXG4gICAgICAgIGlmIChzdW1tYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gc3VtbWFyeS5maW5kKFwidWxcIik7XHJcbiAgICAgICAgICAgIGlmIChsaXN0KVxyXG4gICAgICAgICAgICAgICAgbGlzdC5lbXB0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlQXp1cmVTcWwge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBhd2FpdCBlbGVtZW50LmxvYWRBc3luYyhgL2RhdGFTb3VyY2VzL25ldy9wcm9wZXJ0aWVzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmR2dD1BenVyZVNxbERhdGFiYXNlYCk7XHJcblxyXG4gICAgICAgIC8vIEdldHRpbmcgdGVzdCBidXR0b25cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbiA9ICQoXCIjZGF0YVNvdXJjZVRlc3RCdXR0b25cIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmNsaWNrKGFzeW5jIChldnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZW5naW5lSWQgPSAkKFwiI0RhdGFTb3VyY2VWaWV3X0VuZ2luZUlkXCIpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlbmdpbmVJZClcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi50ZXN0QXN5bmMoYC9hcGkvZGF0YWZhY3Rvcmllcy8ke2VuZ2luZUlkfS90ZXN0YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59Iiwi77u/ZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBhd2FpdCBlbGVtZW50LmxvYWRBc3luYyhgL2RhdGFTb3VyY2VzL25ldy9wcm9wZXJ0aWVzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmR2dD1BenVyZUJsb2JGU2ApO1xyXG5cclxuXHJcbiAgICAgICAgLy8gR2V0dGluZyB0ZXN0IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uID0gJChcIiNkYXRhU291cmNlVGVzdEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfRW5naW5lSWRcIikudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVuZ2luZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLnRlc3RBc3luYyhgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn0iLCLvu79leHBvcnQgY2xhc3MgZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBhd2FpdCBlbGVtZW50LmxvYWRBc3luYyhgL2RhdGFTb3VyY2VzL25ldy9wcm9wZXJ0aWVzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmR2dD1Db3Ntb3NEYmApO1xyXG5cclxuXHJcbiAgICAgICAgLy8gR2V0dGluZyB0ZXN0IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uID0gJChcIiNkYXRhU291cmNlVGVzdEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfRW5naW5lSWRcIikudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVuZ2luZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLnRlc3RBc3luYyhgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSIsIu+7v2V4cG9ydCBjbGFzcyBkYXRhU291cmNlQXp1cmVCbG9iU3RvcmFnZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgbG9hZEFzeW5jKGVuZ2luZUlkLCBodG1sRmllbGRQcmVmaXgsIGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5odG1sRmllbGRQcmVmaXggPSBodG1sRmllbGRQcmVmaXg7XHJcblxyXG4gICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZGF0YVNvdXJjZXMvbmV3L3Byb3BlcnRpZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZHZ0PUF6dXJlQmxvYlN0b3JhZ2VgKTtcclxuXHJcblxyXG4gICAgICAgIC8vIEdldHRpbmcgdGVzdCBidXR0b25cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbiA9ICQoXCIjZGF0YVNvdXJjZVRlc3RCdXR0b25cIik7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmNsaWNrKGFzeW5jIChldnQpID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgZW5naW5lSWQgPSAkKFwiI0RhdGFTb3VyY2VWaWV3X0VuZ2luZUlkXCIpLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChlbmdpbmVJZClcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi50ZXN0QXN5bmMoYC9hcGkvZGF0YWZhY3Rvcmllcy8ke2VuZ2luZUlkfS90ZXN0YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IHdpemFyZFBhZ2UgfSBmcm9tICcuLi93aXphcmQvaW5kZXguanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVTcWwgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZVNxbC5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIuanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVDb3Ntb3NEYiB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIuanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVCbG9iU3RvcmFnZSB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlQmxvYlN0b3JhZ2UuanMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VOZXcgZXh0ZW5kcyB3aXphcmRQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcignRGF0YVNvdXJjZVZpZXcnLCAnL2RhdGFTb3VyY2VzL25ldy9lbmdpbmVzJylcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlQXp1cmVTcWwgPSBuZXcgZGF0YVNvdXJjZUF6dXJlU3FsKCk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyID0gbmV3IGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIoKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VBenVyZUNvc21vc0RiID0gbmV3IGRhdGFTb3VyY2VBenVyZUNvc21vc0RiKCk7XHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlQXp1cmVCbG9iU3RvcmFnZSA9IG5ldyBkYXRhU291cmNlQXp1cmVCbG9iU3RvcmFnZSgpO1xyXG4gICAgICAgIHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9ICcnO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICAgICAgLy8gY2FsbCBiYXNlIG9uTG9hZCBtZXRob2RcclxuICAgICAgICBzdXBlci5vbkxvYWQoKTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLm9uKFwic3RlcENvbnRlbnRcIiwgYXN5bmMgKGUsIGFuY2hvck9iamVjdCwgc3RlcE51bWJlciwgc3RlcERpcmVjdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoc3RlcE51bWJlciA9PSAyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy4kc3Bpbm5lcj8uc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLiRlbmdpbmVJZEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVuZ2luZUlkID0gdGhpcy4kZW5naW5lSWRFbGVtZW50LnZhbCgpLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWVuZ2luZUlkPy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwiZ29Ub1N0ZXBcIiwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZ2V0IHNlbGVjdGlvbiBmcm9tIGRhdGEgc291cmNlcyB0eXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJChgaW5wdXRbbmFtZT1cIkRhdGFTb3VyY2VWaWV3LkRhdGFTb3VyY2VUeXBlXCJdOmNoZWNrZWRgKS52YWwoKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0VHlwZVNlbGVjdGVkID09PSB0eXBlLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPSB0eXBlLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ2F6dXJlc3FsZGF0YWJhc2UnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kYXRhU291cmNlQXp1cmVTcWwubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ2F6dXJlc3FsZHcnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5kYXRhU291cmNlQXp1cmVTcWwubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ2F6dXJlYmxvYmZzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMi5sb2FkQXN5bmMoZW5naW5lSWQsIHRoaXMuaHRtbEZpZWxkUHJlZml4LCB0aGlzLiRwcm9wZXJ0aWVzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSA9PSAnYXp1cmVibG9ic3RvcmFnZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFTb3VyY2VBenVyZUJsb2JTdG9yYWdlLmxvYWRBc3luYyhlbmdpbmVJZCwgdGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdjb3Ntb3NkYicpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFTb3VyY2VBenVyZUNvc21vc0RiLmxvYWRBc3luYyhlbmdpbmVJZCwgdGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJHNwaW5uZXI/LmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8vYXN5bmMgdGVzdENvbm5lY3Rpb25Bc3luYyhldnQpIHtcclxuXHJcbiAgICAvLyAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAvLyAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLnRleHQoXCJcIik7XHJcbiAgICAvLyAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLnJlbW92ZUNsYXNzKCk7XHJcblxyXG4gICAgLy8gICAgdGhpcy5idG5UZXN0Q29ubmVjdGlvbi5kaXNhYmxlKCk7XHJcblxyXG4gICAgLy8gICAgLy8gdXJsIGZvciB0aGF0IHBhcnRpY3VsYXIgZGVwbG95bWVudFxyXG4gICAgLy8gICAgbGV0IHVybCA9IGAvYXBpL2RhdGFTb3VyY2VzL3NxbGNvbm5lY3Rpb24vdGVzdGA7XHJcblxyXG4gICAgLy8gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICAvLyAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAvLyAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBjb25uZWN0aW9uOiB0aGlzLmNvbm5lY3Rpb25TdHJpbmcudmFsKCkgfSksXHJcbiAgICAvLyAgICAgICAgaGVhZGVyczoge1xyXG4gICAgLy8gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgLy8gICAgICAgIH1cclxuICAgIC8vICAgIH0pO1xyXG5cclxuICAgIC8vICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAvLyAgICAgICAgdmFyIGVycm9ySnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgLy8gICAgICAgIGF3YWl0IHRoaXMubGJsVGVzdENvbm5lY3Rpb24udGV4dChlcnJvckpzb24uZXJyb3IpXHJcbiAgICAvLyAgICB9XHJcblxyXG4gICAgLy8gICAgdmFyIHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAvLyAgICBpZiAocmVzdWx0LnJlc3VsdCkge1xyXG4gICAgLy8gICAgICAgIHRoaXMubGJsVGVzdENvbm5lY3Rpb24uYWRkQ2xhc3MoXCJ0ZXh0LXN1Y2Nlc3MgbWwtMlwiKTtcclxuICAgIC8vICAgICAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLmh0bWwoXCI8aSBjbGFzcz0nZmFzIGZhLWNoZWNrLWNpcmNsZSc+PC9pPiAgQ29ubmVjdGlvbiBzdWNjZXNzZnVsXCIpO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgZWxzZSB7XHJcbiAgICAvLyAgICAgICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5hZGRDbGFzcyhcInRleHQtZGFuZ2VyIG1sLTJcIik7XHJcbiAgICAvLyAgICAgICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5odG1sKFwiPGkgY2xhc3M9J2ZhcyBmYS1leGNsYW1hdGlvbi1jaXJjbGUnPjwvaT4gIENhbid0IGNvbm5lY3QgdG8gdGhlIHNvdXJjZSB1c2luZyB0aGlzIGNvbm5lY3Rpb24gc3RyaW5nXCIpO1xyXG4gICAgLy8gICAgfVxyXG5cclxuICAgIC8vICAgIHRoaXMuYnRuVGVzdENvbm5lY3Rpb24uZW5hYmxlKCk7XHJcbiAgICAvL31cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyB3aXphcmRQYWdlIH0gZnJvbSAnLi4vd2l6YXJkL2luZGV4LmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlU3FsIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVTcWwuanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyLmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZUNvc21vc0RiLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlRWRpdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gJChcIiNEYXRhU291cmNlVmlld19FbmdpbmVJZFwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24gPSAkKFwiI2RhdGFTb3VyY2VUZXN0QnV0dG9uXCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24ubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmdpbmVJZClcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi50ZXN0QXN5bmMoYC9hcGkvZGF0YWZhY3Rvcmllcy8ke3RoaXMuZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRzb3VyY2VDb2RlID0gJChcIiNzb3VyY2VDb2RlXCIpO1xyXG5cclxuICAgICAgICBsZXQganNvbk9iamVjdFN0cmluZyA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfSnNvblN0cmluZ1wiKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKGpzb25PYmplY3RTdHJpbmcgJiYganNvbk9iamVjdFN0cmluZy5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBvID0gSlNPTi5wYXJzZShqc29uT2JqZWN0U3RyaW5nKTtcclxuICAgICAgICAgICAgbGV0IGpzb25TdHJpbmcgPSBQcmlzbS5oaWdobGlnaHQoSlNPTi5zdHJpbmdpZnkobywgbnVsbCwgMiksIFByaXNtLmxhbmd1YWdlcy5qc29uLCAnanNvbicpO1xyXG5cclxuICAgICAgICAgICAgbGV0ICRzb3VyY2VDb2RlID0gJChcIiNzb3VyY2VDb2RlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRzb3VyY2VDb2RlKVxyXG4gICAgICAgICAgICAgICAgJHNvdXJjZUNvZGUuaHRtbChqc29uU3RyaW5nKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Qb3N0Qm9keShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lID0gZGF0YVswXTtcclxuICAgICAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdjaGVjaycsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkNsaWNrUm93KHJvdykge1xyXG4gICAgICAgIHRoaXMuZW5naW5lID0gcm93O1xyXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZEVudGl0aWVzQXN5bmModGhpcy5lbmdpbmUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIC8vIGdldCB0YWJsZVxyXG4gICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZSA9ICQoXCIjZW5naW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuJGVuZ2luZXNUYWJsZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSh0aGlzLiRlbmdpbmVzVGFibGUsICcvZW50aXRpZXMvaW5kZXgvZW5naW5lcycsIHRydWUsXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiB0aGlzLm9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3cpID0+IHRoaXMub25DbGlja1Jvdyhyb3cpKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZSA9ICQoXCIjZW50aXRpZXNUYWJsZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgICAgIGZvcm1hdE5vTWF0Y2hlczogKCkgPT4geyByZXR1cm4gJ1BsZWFzZSBzZWxlY3QgYSBydW5uaW5nIGVuZ2luZSB0byBzZWUgYWxsIHRoZSBlbnRpdGllcy4nOyB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUub24oJ2NsaWNrLXJvdy5icy50YWJsZScsIChyb3csICRlbGVtZW50LCBmaWVsZCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvRW50aXRpZXMvRWRpdC8ke3RoaXMuZW5naW5lLmlkfS8keyRlbGVtZW50Lm5hbWV9YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiBcclxuXHJcblxyXG4gICAgYXN5bmMgbG9hZEVudGl0aWVzQXN5bmMoZW5naW5lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3Nob3dMb2FkaW5nJyk7XHJcbiAgICAgICAgbGV0IGRhdGFfdXJsID0gYC9lbnRpdGllcy9pbmRleC9lbnRpdGllcz9lbmdpbmVJZD0ke2VuZ2luZS5pZH1gO1xyXG4gICAgICAgIGxldCBlbnRpdGllc1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goZGF0YV91cmwpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBhd2FpdCBlbnRpdGllc1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmVudGl0aWVzKVxyXG4gICAgICAgICAgICB0aGlzLmVudGl0aWVzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3VwZGF0ZUZvcm1hdFRleHQnLCAnZm9ybWF0Tm9NYXRjaGVzJyxcclxuICAgICAgICAgICAgYE5vIGVudGl0aWVzIGZvciBlbmdpbmUgPHN0cm9uZz4ke2VuZ2luZS5lbmdpbmVOYW1lfTwvc3Ryb25nPi4gPGEgaHJlZj0nL2VudGl0aWVzL25ldyc+Q3JlYXRlIGEgbmV3IGVudGl0eTwvYT4gZm9yIHlvdXIgZW5naW5lYCk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2xvYWQnLCB0aGlzLmVudGl0aWVzKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnaGlkZUxvYWRpbmcnKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIG9uVW5Mb2FkKCkge1xyXG5cclxuICAgIH1cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsLCBtb2RhbFBhbmVsRXJyb3IgfSBmcm9tICcuLi9tb2RhbC9pbmRleCc7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNBenVyZVNxbCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmdpbmVJZFxyXG4gICAgICovXHJcbiAgICBhc3luYyBsb2FkQXN5bmMoaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50LCBlbmdpbmVJZCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcbiAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9lbnRpdGllcy9uZXcvZW50aXRpZXM/ZHZ0PUF6dXJlU3FsVGFibGUmZW5naW5lSWQ9JHtlbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IGVycm9ycyBsYWJlbHNcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMgPSAkKFwiI2xhYmVsRXJyb3JEYXRhU291cmNlc1wiKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yVGFibGVzID0gJChcIiNsYWJlbEVycm9yVGFibGVzXCIpO1xyXG5cclxuICAgICAgICAvLyBvbmNlIGxvYWRlZCwgZ2V0IHRoZSBzZWxlY3RvcnNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lYCk7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlc0l0ZW1zU3RyaW5nYCk7XHJcbiAgICAgICAgLy8gb24gZGF0YSBzb3VyY2VzIGNoYW5nZXMsIHJlZnJlc2ggdGhlIHRhYmxlc1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmNoYW5nZShhc3luYyAoKSA9PiB7IGF3YWl0IHRoaXMucmVmcmVzaFRhYmxlc0FzeW5jKGVuZ2luZUlkKSB9KTtcclxuXHJcbiAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9VGFibGVOYW1lYCk7XHJcbiAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0U3RyaW5nID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9VGFibGVzSXRlbXNTdHJpbmdgKTtcclxuICAgICAgICAvLyBvbiB0YWJsZSBjaGFuZ2UsIHNldCB0aGUgY29ycmVjdCBhdHRyaWJ1dGVzIGZvciB0aGUgcHJldmlldyBidXR0b25cclxuICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuY2hhbmdlKCgpID0+IHsgdGhpcy5zZXRQcmV2aWV3RGF0YUF0dHJpYnV0ZXMoZW5naW5lSWQpIH0pO1xyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpLCAxMCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpIHtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kaXNhYmxlUGlja2VyKFwiTG9hZGluZyBEYXRhIFNvdXJjZXMgLi4uXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VzVXJsID0gYC9lbnRpdGllcy9uZXcvZGF0YXNvdXJjZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZGF0YVNvdXJjZVR5cGU9QXp1cmVTcWxEYXRhYmFzZWA7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGRhdGFTb3VyY2VzVXJsKTtcclxuICAgICAgICAgICAgbGV0IGRhdGFTb3VyY2VzID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLnRleHQodGV4dC5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGRhdGFTb3VyY2VzSnNvbiA9IGF3YWl0IHIuanNvbigpO1xyXG5cclxuICAgICAgICAgICAgZGF0YVNvdXJjZXMgPSBkYXRhU291cmNlc0pzb24ubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhU291cmNlcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0sIHRleHQ6IGl0ZW0gfSkpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFkYXRhU291cmNlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiTm8gRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcudmFsKCcnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoZGF0YVNvdXJjZXMuam9pbigpKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGRhdGFTb3VyY2VTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGFTb3VyY2VTZWxlY3RlZClcclxuICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaFRhYmxlc0FzeW5jKGVuZ2luZUlkKTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dChcIlVuZXhwZWN0ZWQgU2VydmVyIGVycm9yXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIkNhbid0IGxvYWQgRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG5cclxuICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yRGF0YVNvdXJjZXNcIiwgZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlZnJlc2hUYWJsZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJsb2FkaW5nIHRhYmxlcyAuLi5cIik7XHJcblxyXG4gICAgICAgIGxldCBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuICAgICAgICBsZXQgdGFibGVzID0gW107XHJcbiAgICAgICAgbGV0IHRhYmxlc1VybCA9IGAvYXBpL0F6dXJlU3FsRGF0YWJhc2UvJHtlbmdpbmVJZH0vJHtkYXRhU291cmNlU2VsZWN0ZWR9L3RhYmxlc2A7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcblxyXG5cclxuICAgICAgICAgICAgbGV0IHIgPSBhd2FpdCBmZXRjaCh0YWJsZXNVcmwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRUeXBlID0gci5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSkgPyAoYXdhaXQgci5qc29uKCkpLmVycm9yLm1lc3NhZ2UgOiBhd2FpdCByLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgIT0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFibGVzSnNvbiA9IGF3YWl0IHIuanNvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRhYmxlcyA9IHRhYmxlc0pzb24ubWFwKGl0ZW0gPT4gYCR7aXRlbS5zY2hlbWFOYW1lfS4ke2l0ZW0udGFibGVOYW1lfWApO1xyXG5cclxuICAgICAgICAgICAgICAgICQuZWFjaCh0YWJsZXMsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0sIHRleHQ6IGl0ZW0gfSkpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCF0YWJsZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuZGF0YShcIm5vbmVTZWxlY3RlZFRleHRcIiwgXCJObyBUYWJsZXMuLi5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3RTdHJpbmcudmFsKCcnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdFN0cmluZy52YWwodGFibGVzLmpvaW4oKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciB0YWJsZVNlbGVjdGVkID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9VGFibGVOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRhYmxlU2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFByZXZpZXdEYXRhQXR0cmlidXRlcyhlbmdpbmVJZCk7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMudGV4dChcIlVuZXhwZWN0ZWQgU2VydmVyIGVycm9yXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuZGF0YShcIm5vbmVTZWxlY3RlZFRleHRcIiwgXCJDYW4ndCBsb2FkIERhdGEgU291cmNlcy4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIG5ldyBtb2RhbFBhbmVsRXJyb3IoXCJlcnJvckRhdGFTb3VyY2VzXCIsIGUpLnNob3coKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHNldFByZXZpZXdEYXRhQXR0cmlidXRlcyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKCFkYXRhU291cmNlU2VsZWN0ZWQ/Lmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgdGFibGVTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fVRhYmxlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKCF0YWJsZVNlbGVjdGVkPy5sZW5ndGgpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdmFyIHRhYmxlVGFiID0gdGFibGVTZWxlY3RlZC5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgdmFyIHNjaGVtYU5hbWUgPSB0YWJsZVRhYlswXTtcclxuICAgICAgICB2YXIgdGFibGVOYW1lID0gdGFibGVUYWJbMV07XHJcblxyXG4gICAgICAgIC8vIGJlZm9yZSByZWZyZXNoaW5nIGNvbHVtbnMsIGFkZCBkYXRhIHRvIHByZXZpZXcgYnV0dG9uc1xyXG4gICAgICAgIGxldCAkcHJldmlld0VudGl0eUJ1dHRvbiA9ICQoXCIjcHJldmlld0VudGl0eUJ1dHRvblwiKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwiZW5naW5lLWlkXCIsIGVuZ2luZUlkKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwiZGF0YS1zb3VyY2UtbmFtZVwiLCBkYXRhU291cmNlU2VsZWN0ZWQpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJzY2hlbWEtbmFtZVwiLCBzY2hlbWFOYW1lKTtcclxuICAgICAgICAkcHJldmlld0VudGl0eUJ1dHRvbi5kYXRhKFwidGFibGUtbmFtZVwiLCB0YWJsZU5hbWUpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJ0aXRsZVwiLCBgVGFibGUgcHJldmlldyBbJHtzY2hlbWFOYW1lfV0uWyR7dGFibGVOYW1lfV1gKTtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5cclxuaW1wb3J0IHsgbW9kYWxQYW5lbEVycm9yIH0gZnJvbSBcIi4uL21vZGFsL2luZGV4XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNEZWxpbWl0ZWRUZXh0IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmdpbmVJZFxyXG4gICAgICovXHJcbiAgICBhc3luYyBsb2FkQXN5bmMoaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50LCBlbmdpbmVJZCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcbiAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9lbnRpdGllcy9uZXcvZW50aXRpZXM/ZHZ0PURlbGltaXRlZFRleHQmZW5naW5lSWQ9JHtlbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIGFsbCBzZWxlY3QgcGlja2VyIGludG8gc2VsZWN0cGlja2VyXHJcbiAgICAgICAgJCgnc2VsZWN0Jykuc2VsZWN0cGlja2VyKCk7XHJcblxyXG5cclxuICAgICAgICAvLyBvbmNlIGxvYWRlZCwgZ2V0IHRoZSBzZWxlY3RvcnNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lYCk7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlc0l0ZW1zU3RyaW5nYCk7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzID0gJChcIiNsYWJlbEVycm9yRGF0YVNvdXJjZXNcIik7XHJcbiAgICAgICAgLy8gb24gZGF0YSBzb3VyY2VzIGNoYW5nZXMsIHJlZnJlc2ggdGhlIHRhYmxlc1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmNoYW5nZShhc3luYyAoKSA9PiB7IGF3YWl0IHRoaXMucmVmcmVzaFN0b3JhZ2VzUGF0aHMoZW5naW5lSWQpIH0pO1xyXG5cclxuXHJcbiAgICAgICAgdGhpcy4kZGlyZWN0b3J5UGF0aFNlbGVjdCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fUZ1bGxQYXRoYCk7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRpcmVjdG9yeVBhdGggPSAkKFwiI2xhYmVsRXJyb3JEaXJlY3RvcnlQYXRoXCIpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWZyZXNoRGF0YVNvdXJjZXNBc3luYyhlbmdpbmVJZCksIDEwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIHJlZnJlc2hEYXRhU291cmNlc0FzeW5jKGVuZ2luZUlkKSB7XHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZGlzYWJsZVBpY2tlcihcIkxvYWRpbmcgRGF0YSBTb3VyY2VzIC4uLlwiKTtcclxuICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VzID0gW107XHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gYXdhaXQgZmV0Y2goYC9lbnRpdGllcy9uZXcvZGF0YXNvdXJjZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZGF0YVNvdXJjZVR5cGU9QXp1cmVCbG9iU3RvcmFnZWApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRUeXBlID0gci5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSkgPyAoYXdhaXQgci5qc29uKCkpLmVycm9yLm1lc3NhZ2UgOiBhd2FpdCByLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy50ZXh0KHRleHQuZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IGRhdGFTb3VyY2VzSnNvbiA9IGF3YWl0IHIuanNvbigpO1xyXG4gICAgICAgICAgICBkYXRhU291cmNlcyA9IGRhdGFTb3VyY2VzSnNvbjtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhU291cmNlcywgKGksIGl0ZW0pID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBKU09OLnN0cmluZ2lmeShpdGVtKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5hcHBlbmQoJCgnPG9wdGlvbj4nLCB7IHZhbHVlOiB2YWx1ZSwgdGV4dDogaXRlbS5uYW1lIH0pKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHIgPSBhd2FpdCBmZXRjaChgL2VudGl0aWVzL25ldy9kYXRhc291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkYXRhU291cmNlVHlwZT1BenVyZUJsb2JGU2ApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRUeXBlID0gci5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSkgPyAoYXdhaXQgci5qc29uKCkpLmVycm9yLm1lc3NhZ2UgOiBhd2FpdCByLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy50ZXh0KHRleHQuZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZGF0YVNvdXJjZXNKc29uID0gYXdhaXQgci5qc29uKCk7XHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2VzID0gZGF0YVNvdXJjZXNKc29uO1xyXG4gICAgICAgICAgICAvL2RhdGFTb3VyY2VzID0gZGF0YVNvdXJjZXNKc29uLm1hcChpdGVtID0+IGl0ZW0ubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGF0YVNvdXJjZXMsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBKU09OLnN0cmluZ2lmeShpdGVtKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IHZhbHVlLCB0ZXh0OiBpdGVtLm5hbWUgfSkpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmICghZGF0YVNvdXJjZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIk5vIERhdGEgU291cmNlcy4uLlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nLnZhbCgnJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcudmFsKGRhdGFTb3VyY2VzLmpvaW4oKSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhU291cmNlU2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hTdG9yYWdlc1BhdGhzKGVuZ2luZUlkLCBkYXRhU291cmNlU2VsZWN0ZWQpO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy50ZXh0KFwiVW5leHBlY3RlZCBTZXJ2ZXIgZXJyb3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiQ2FuJ3QgbG9hZCBEYXRhIFNvdXJjZXMuLi5cIik7XHJcblxyXG4gICAgICAgICAgICBuZXcgbW9kYWxQYW5lbEVycm9yKFwiZXJyb3JcIiwgZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyByZWZyZXNoU3RvcmFnZXNQYXRocyhlbmdpbmVJZCkge1xyXG5cclxuICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy4kZGlyZWN0b3J5UGF0aFNlbGVjdC5kaXNhYmxlUGlja2VyKFwiTG9hZGluZyBhbGwgcGF0aHMgLi4uXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGxldCBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2UgPSBKU09OLnBhcnNlKGRhdGFTb3VyY2VTZWxlY3RlZCk7XHJcblxyXG4gICAgICAgIGxldCBlbnRpdHlMb2NhdGlvblR5cGVFbGVtZW50ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9TG9jYXRpb25UeXBlYCk7XHJcblxyXG4gICAgICAgIGlmIChkYXRhU291cmNlLmRhdGFTb3VyY2VUeXBlID09PSAnQXp1cmVCbG9iU3RvcmFnZScpXHJcbiAgICAgICAgICAgIGVudGl0eUxvY2F0aW9uVHlwZUVsZW1lbnQudmFsKCdBenVyZUJsb2JTdG9yYWdlTG9jYXRpb24nKTtcclxuICAgICAgICBlbHNlIGlmIChkYXRhU291cmNlLmRhdGFTb3VyY2VUeXBlID09PSAnQXp1cmVCbG9iRlMnKVxyXG4gICAgICAgICAgICBlbnRpdHlMb2NhdGlvblR5cGVFbGVtZW50LnZhbCgnQXp1cmVCbG9iRlNMb2NhdGlvbicpO1xyXG5cclxuXHJcblxyXG4gICAgICAgIGxldCBkaXJlY3RvcmllcyA9IFtdO1xyXG4gICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGAvYXBpL3N0b3JhZ2VzLyR7ZW5naW5lSWR9LyR7ZGF0YVNvdXJjZS5uYW1lfS9maWxlc2ApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHIuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbnRlbnRUeXBlID0gci5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXh0ID0gKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoXCJqc29uXCIpICE9PSAtMSkgPyAoYXdhaXQgci5qc29uKCkpLmVycm9yLm1lc3NhZ2UgOiBhd2FpdCByLnRleHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoLnRleHQodGV4dC5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgZGlyZWN0b3JpZXNKc29uID0gYXdhaXQgci5qc29uKCk7XHJcbiAgICAgICAgICAgIGRpcmVjdG9yaWVzID0gZGlyZWN0b3JpZXNKc29uLm1hcChpdGVtID0+IGl0ZW0ubmFtZSk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZGlyZWN0b3JpZXMsIChpLCBpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0sIHRleHQ6IGl0ZW0gfSkpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoLnRleHQoXCJVbmV4cGVjdGVkIFNlcnZlciBlcnJvclwiKTtcclxuICAgICAgICAgICAgdGhpcy4kZGlyZWN0b3J5UGF0aFNlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIkNhbid0IGxvYWQgU3RvcmFnZSBmaWxlcy4uLlwiKTtcclxuXHJcbiAgICAgICAgICAgIG5ldyBtb2RhbFBhbmVsRXJyb3IoXCJlcnJvclwiLCBlKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmVuYWJsZVBpY2tlcigpO1xyXG5cclxuICAgIH1cclxufVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbEVycm9yLCBtb2RhbFBhbmVsUHJldmlldyB9IGZyb20gXCIuLi9tb2RhbC9pbmRleC5qc1wiO1xyXG5pbXBvcnQgeyBlbnRpdGllc0F6dXJlU3FsIH0gZnJvbSBcIi4vZW50aXRpZXNBenVyZVNxbC5qc1wiO1xyXG5pbXBvcnQgeyBlbnRpdGllc0RlbGltaXRlZFRleHQgfSBmcm9tIFwiLi9lbnRpdGllc0RlbGltaXRlZFRleHQuanNcIjtcclxuaW1wb3J0IHsgd2l6YXJkUGFnZSB9IGZyb20gJy4uL3dpemFyZC9pbmRleC5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNOZXdQYWdlIGV4dGVuZHMgd2l6YXJkUGFnZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoJ0VudGl0eVZpZXcnLCAnL2VudGl0aWVzL25ldy9lbmdpbmVzJyk7XHJcblxyXG4gICAgICAgIHRoaXMuZW50aXRpZXNBenVyZVNxbCA9IG5ldyBlbnRpdGllc0F6dXJlU3FsKCk7XHJcbiAgICAgICAgdGhpcy5lbnRpdGllc0RlbGltaXRlZFRleHQgPSBuZXcgZW50aXRpZXNEZWxpbWl0ZWRUZXh0KCk7XHJcbiAgICAgICAgdGhpcy5sYXN0VHlwZVNlbGVjdGVkID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vIGNhbGwgYmFzZSBvbkxvYWQgbWV0aG9kXHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcblxyXG4gICAgICAgIC8vIGluaXQgcHJldmlldyBwYW5lbFxyXG4gICAgICAgIG1vZGFsUGFuZWxQcmV2aWV3LmluaXRpYWxpemUoXCJwYW5lbFByZXZpZXdcIik7XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBhbGwgc2VsZWN0IHBpY2tlciBpbnRvIHNlbGVjdHBpY2tlclxyXG4gICAgICAgICQoJ3NlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5vbihcImxlYXZlU3RlcFwiLCAoZSwgYW5jaG9yT2JqZWN0LCBjdXJyZW50U3RlcEluZGV4LCBuZXh0U3RlcEluZGV4LCBzdGVwRGlyZWN0aW9uKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoY3VycmVudFN0ZXBJbmRleCA9PSAxICYmIG5leHRTdGVwSW5kZXggPT0gMikge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCB0eXBlID0gJChgaW5wdXRbbmFtZT1cIkVudGl0eVZpZXcuRW50aXR5VHlwZVwiXTpjaGVja2VkYCkudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICh0eXBlICE9PSAnQXp1cmVTcWxUYWJsZScgJiYgdHlwZSAhPT0gJ0RlbGltaXRlZFRleHQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcignZW50aXR5U3RlcE5vdEV4aXN0JywgJ3RoaXMgZW50aXR5IGlzIG5vdCB5ZXQgaW1wbGVtZW50ZWQuLi4nKS5zaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwiZ29Ub1N0ZXBcIiwgMSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQub24oXCJzdGVwQ29udGVudFwiLCBhc3luYyAoZSwgYW5jaG9yT2JqZWN0LCBzdGVwTnVtYmVyLCBzdGVwRGlyZWN0aW9uKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RlcE51bWJlciA9PSAyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuJGVuZ2luZUlkRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZW5naW5lSWQgPSB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZW5naW5lSWQ/Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJnb1RvU3RlcFwiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAkKGBpbnB1dFtuYW1lPVwiRW50aXR5Vmlldy5FbnRpdHlUeXBlXCJdOmNoZWNrZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJnb1RvU3RlcFwiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9PT0gdHlwZS50b1N0cmluZygpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0VHlwZVNlbGVjdGVkID0gdHlwZS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ0F6dXJlU3FsVGFibGUnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5lbnRpdGllc0F6dXJlU3FsLmxvYWRBc3luYyh0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcywgZW5naW5lSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PSAnRGVsaW1pdGVkVGV4dCcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVudGl0aWVzRGVsaW1pdGVkVGV4dC5sb2FkQXN5bmModGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMsIGVuZ2luZUlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJnb1RvU3RlcFwiLCAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgYXN5bmMgb25VbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5sZXQganF1ZXJ5RXh0ZW5kcyA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAvLyBleHRlbmQgcGlja2VyXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgZGlzYWJsZVBpY2tlcjogZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICB0aGlzLmVtcHR5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXR0cihcImRpc2FibGVkXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBtc2cpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdHBpY2tlcigncmVmcmVzaCcpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBlbmFibGVQaWNrZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVBdHRyKFwiZGlzYWJsZWRcIik7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIGV4dGVuZCBlbmFibGUgZGlzYWJsZSBvZiBidXR0b25zIGFuZCBhIGhyZWZcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBlbmFibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRpc2FibGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgLy8gZXh0ZW5kIGxvYWQgYXN5bmNcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBsb2FkQXN5bmM6IGZ1bmN0aW9uIChkYXRhX3VybCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkKGRhdGFfdXJsLCAocmVzcG9uc2UsIHN0YXR1cywgeGhyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBcImVycm9yXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIHRlc3RBc3luYzogYXN5bmMgZnVuY3Rpb24gKHVybCkge1xyXG5cclxuICAgICAgICAgICAgLy8gdGhpcyBpcyB0aGUgYnV0dG9uIHdoaWNoIGNsaWNrZWQgIVxyXG4gICAgICAgICAgICBsZXQgJGJ0biA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkLWZsZXggYWxpZ24taXRlbXMtYmFzZWxpbmUgdGV4dC1ub3dyYXAnKS5hZGRDbGFzcygnZC1mbGV4IGFsaWduLWl0ZW1zLWJhc2VsaW5lIHRleHQtbm93cmFwJyk7XHJcblxyXG4gICAgICAgICAgICBsZXQgYnRuSWQgPSAkYnRuLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgICAgIGxldCBzcGlubmVySWQgPSBgJHtidG5JZH1TcGlubmVyYDtcclxuICAgICAgICAgICAgbGV0IG1lc3NhZ2VJZCA9IGAke2J0bklkfU1lc3NhZ2VgO1xyXG5cclxuICAgICAgICAgICAgbGV0ICRzcGlubmVyU3BhbiA9ICQoYCMke3NwaW5uZXJJZH1gKTtcclxuICAgICAgICAgICAgbGV0ICRtZXNzYWdlU3BhbiA9ICQoYCMke21lc3NhZ2VJZH1gKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghJHNwaW5uZXJTcGFuLmxlbmd0aClcclxuICAgICAgICAgICAgICAgICRidG4uYWZ0ZXIoYDxzcGFuIGlkPSR7c3Bpbm5lcklkfSBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIiBjbGFzcz1cIm1sLTJcIj48aSBjbGFzcz1cImZhcyBmYS1zcGlubmVyIGZhLXNwaW5cIj48L2k+PC9zcGFuPmApO1xyXG5cclxuICAgICAgICAgICAgJHNwaW5uZXJTcGFuID0gJChgIyR7c3Bpbm5lcklkfWApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkbWVzc2FnZVNwYW4ubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgJHNwaW5uZXJTcGFuLmFmdGVyKGA8c3BhbiBpZD0ke21lc3NhZ2VJZH0gc3R5bGU9XCJkaXNwbGF5Om5vbmU7XCIgY2xhc3M9XCJtbC0yXCI+PC9zcGFuPmApO1xyXG5cclxuICAgICAgICAgICAgJG1lc3NhZ2VTcGFuID0gJChgIyR7bWVzc2FnZUlkfWApO1xyXG5cclxuICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmhpZGUoKTtcclxuICAgICAgICAgICAgJHNwaW5uZXJTcGFuLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHIgPSBhd2FpdCAkYnRuLnBvc3RBc3luYyh1cmwsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc3Bpbm5lclNwYW4uaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyLmVycm9ycyB8fCByID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyICYmIHIuZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IE9iamVjdC52YWx1ZXMoci5lcnJvcnMpLmZsYXRNYXAoZSA9PiBlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBbXCJDYW4ndCBjb25uZWN0XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGh0bWwgPSBgPGkgY2xhc3M9XCJmYXMgZmEtZXhjbGFtYXRpb25cIj48L2k+ICR7ZXJyb3JzWzBdfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmFkZENsYXNzKFwidGV4dC1kYW5nZXJcIikucmVtb3ZlQ2xhc3MoXCJ0ZXh0LXN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBodG1sID0gJzxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrXCI+PC9pPiBjb25uZWN0aW9uIHN1Y2Nlc3NmdWwnO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZXNzYWdlU3Bhbi5odG1sKGh0bWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZXNzYWdlU3Bhbi5hZGRDbGFzcyhcInRleHQtc3VjY2Vzc1wiKS5yZW1vdmVDbGFzcyhcInRleHQtZGFuZ2VyXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLnNob3coKTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yRXh0ZW5zaW9uUG9zdFwiLCBlKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgcG9zdEFzeW5jOiBhc3luYyBmdW5jdGlvbiAodXJsLCBjaGVja0lzVmFsaWQpIHtcclxuXHJcbiAgICAgICAgICAgIGlmICghJChcImZvcm1cIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hlY2tJc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBMYXVuY2ggYSB2YWxpZGF0aW9uIGJlZm9yZVxyXG4gICAgICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSAkKFwiZm9ybVwiKS52YWxpZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaXNWYWxpZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBmb3JtVmFsdWVzID0gJCgnZm9ybScpLnNlcmlhbGl6ZUFycmF5KCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm9ybWRhdGEgPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICAgICAgJC5lYWNoKGZvcm1WYWx1ZXMsIGZ1bmN0aW9uIChpLCB2KSB7XHJcbiAgICAgICAgICAgICAgICBmb3JtZGF0YS5hcHBlbmQodi5uYW1lLCB2LnZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IGZvcm1kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VKc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwIHx8IHJlc3BvbnNlSnNvbiA9PT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoZWNrSXNWYWxpZCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9ICQoZG9jdW1lbnQpLmZpbmQoXCJbZGF0YS12YWxtc2ctc3VtbWFyeT10cnVlXVwiKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QgPSBjb250YWluZXIuZmluZChcInVsXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGVycm9ycyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlSnNvbiAmJiByZXNwb25zZUpzb24uZXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBPYmplY3QudmFsdWVzKHJlc3BvbnNlSnNvbi5lcnJvcnMpLmZsYXRNYXAoZSA9PiBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IFtcIkNhbid0IGNvbm5lY3RcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ICYmIGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0LmVtcHR5KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuYWRkQ2xhc3MoXCJ2YWxpZGF0aW9uLXN1bW1hcnktZXJyb3JzXCIpLnJlbW92ZUNsYXNzKFwidmFsaWRhdGlvbi1zdW1tYXJ5LXZhbGlkXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChlcnJvcnMsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwiPGxpIC8+XCIpLmh0bWwodGhpcykuYXBwZW5kVG8obGlzdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2VKc29uO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXJFeGNlcHRpb246IFtlXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuXHJcblxyXG4vL2FzeW5jIHBvc3RBc3luYygpIHtcclxuLy8gICAgLy8gRmlyc3QsIHNhdmUgdGhlIGRlcGxveW1lbnQuXHJcblxyXG4vLyAgICBsZXQgdG9rZW4gPSAkKCdpbnB1dFtuYW1lPVwiX19SZXF1ZXN0VmVyaWZpY2F0aW9uVG9rZW5cIl0nKS52YWwoKTtcclxuXHJcbi8vICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcnLCB7XHJcbi8vICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuLy8gICAgICAgIGJvZHk6IGBkYXRhU291cmNlVmlldy5FbmdpbmVJZD0ke3RoaXMuZGF0YVNvdXJjZVZpZXcuZW5naW5lSWR9YCArXHJcbi8vICAgICAgICAgICAgYCZkYXRhU291cmNlVmlldy5EYXRhU291cmNlVHlwZT0ke3RoaXMuZGF0YVNvdXJjZVZpZXcuZGF0YVNvdXJjZVR5cGV9YCArXHJcbi8vICAgICAgICAgICAgYCZkYXRhU291cmNlVmlldy5Db25uZWN0aW9uU3RyaW5nPSR7dGhpcy5kYXRhU291cmNlVmlldy5jb25uZWN0aW9uU3RyaW5nfWAgK1xyXG4vLyAgICAgICAgICAgIGAmX19SZXF1ZXN0VmVyaWZpY2F0aW9uVG9rZW49JHt0b2tlbn1gLFxyXG4vLyAgICAgICAgaGVhZGVyczoge1xyXG4vLyAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PXV0Zi04XCJcclxuLy8gICAgICAgIH1cclxuLy8gICAgfSk7XHJcblxyXG4vL31cclxuXHJcbmV4cG9ydCBkZWZhdWx0IChqcXVlcnlFeHRlbmRzKSgpOyIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgcm91dGVyIGZyb20gXCIuL3JvdXRlci5qc1wiO1xyXG5pbXBvcnQgeyBkYXNoYm9hcmRQYWdlIH0gZnJvbSBcIi4vZGFzaGJvYXJkL2luZGV4LmpzXCI7XHJcbmltcG9ydCB7IGVuZ2luZXNQYWdlLCBlbmdpbmVEZXRhaWxzUGFnZSB9IGZyb20gXCIuL2VuZ2luZXMvaW5kZXguanNcIjtcclxuaW1wb3J0IHsgYWRtaW5QYWdlLCBhZG1pbkRlcGxveW1lbnRFbmdpbmVQYWdlLCBhZG1pbkVuZ2luZVJlcXVlc3REZXRhaWxzUGFnZSB9IGZyb20gXCIuL2FkbWluL2luZGV4LmpzXCI7XHJcbmltcG9ydCB7IG1ndGxvYWRlciB9IGZyb20gXCIuL21ndC5qc1wiO1xyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi9ub3RpZmljYXRpb24uanNcIjtcclxuaW1wb3J0IHsgaG9tZVBhZ2UgfSBmcm9tIFwiLi9ob21lL2hvbWVQYWdlLmpzXCI7XHJcbmltcG9ydCB7IHNldHRpbmdzUGFnZSB9IGZyb20gXCIuL3NldHRpbmdzL3NldHRpbmdzUGFnZS5qc1wiO1xyXG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4vYXV0aC5qc1wiXHJcbmltcG9ydCB7IGRvdG1pbXRhYmxlIH0gZnJvbSBcIi4vZG90bWltdGFibGVcIlxyXG5pbXBvcnQgeyBwZXJzb25Gb3JtYXR0ZXJzIH0gZnJvbSAnLi9mb3JtYXR0ZXJzL2luZGV4LmpzJ1xyXG5pbXBvcnQgeyBkYXRhU291cmNlTmV3LCBkYXRhU291cmNlc1BhZ2UsIGRhdGFTb3VyY2VFZGl0IH0gZnJvbSAnLi9kYXRhU291cmNlcy9pbmRleC5qcydcclxuaW1wb3J0IHsgZW50aXRpZXNQYWdlLCBlbnRpdGllc05ld1BhZ2UgfSBmcm9tICcuL2VudGl0aWVzL2luZGV4LmpzJ1xyXG5pbXBvcnQgZCBmcm9tICcuL2V4dGVuc2lvbnMuanMnO1xyXG5cclxuZG90bWltdGFibGUuaW5pdGlhbGl6ZSgpO1xyXG5cclxuLy8gSW5pdGlhbGl6ZSBob21lIHBhZ2UgdG8gcmVnaXN0ZXIgbm90aWZpY2F0aW9uc1xyXG5ob21lUGFnZS5jdXJyZW50LmluaXRpYWxpemUoKTtcclxuXHJcbi8vIEluaXRpYWxpemUgYXV0aCBoZWxwZXJcclxuYXV0aC5jdXJyZW50LmluaXRpYWxpemUoKTtcclxuXHJcblxyXG5tZ3Rsb2FkZXIuc2V0TWd0UHJvdmlkZXIoKTtcclxubWd0bG9hZGVyLmludGVyY2VwdE1ndExvZ2luKCk7XHJcblxyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXNoYm9hcmQnLCBkYXNoYm9hcmRQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRGFzaGJvYXJkL0luZGV4JywgZGFzaGJvYXJkUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VuZ2luZXMnLCBlbmdpbmVzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VuZ2luZXMvSW5kZXgnLCBlbmdpbmVzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VuZ2luZXMvRGV0YWlscycsIGVuZ2luZURldGFpbHNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvQWRtaW4vSW5kZXgnLCBhZG1pblBhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9BZG1pbicsIGFkbWluUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL1NldHRpbmdzL0luZGV4Jywgc2V0dGluZ3NQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvU2V0dGluZ3MnLCBzZXR0aW5nc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9BZG1pbi9EZXRhaWxzJywgYWRtaW5FbmdpbmVSZXF1ZXN0RGV0YWlsc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9BZG1pbi9EZXBsb3knLCBhZG1pbkRlcGxveW1lbnRFbmdpbmVQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRGF0YVNvdXJjZXMnLCBkYXRhU291cmNlc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXRhU291cmNlcy9OZXcnLCBkYXRhU291cmNlTmV3KTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRGF0YVNvdXJjZXMvRWRpdCcsIGRhdGFTb3VyY2VFZGl0KTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW50aXRpZXMnLCBlbnRpdGllc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9FbnRpdGllcy9OZXcnLCBlbnRpdGllc05ld1BhZ2UpO1xyXG4iXSwibmFtZXMiOlsibW9kYWxQYW5lbEVycm9yIiwicm91dGVyIl0sIm1hcHBpbmdzIjoiQUFBQztBQUNEO0FBQ08sTUFBTSxNQUFNLENBQUM7QUFD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LElBQUksQ0FBQyxDQUFDO0FBQzdDLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3hDLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQy9DLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO0FBQzdDO0FBQ0E7QUFDQSxRQUFRLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3BELFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDaEQ7QUFDQTtBQUNBLFFBQVEsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDM0IsUUFBUSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztBQUM1QixRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQztBQUN0QztBQUNBLFFBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUs7QUFDcEMsWUFBWSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDakMsWUFBWSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkIsU0FBUyxDQUFDLENBQUM7QUFDWDtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUs7QUFDckMsWUFBWSxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDakMsWUFBWSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2hELFlBQVksSUFB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