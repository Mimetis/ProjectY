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


        if (!this.isLoaded) {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureSqlDatabase`);
        }
 
        this.isLoaded = true;

    }

}

class dataSourceAzureDataLakeV2 {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (!this.isLoaded) {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureBlobFS`);
        }


        this.isLoaded = true;

    }

}

class dataSourceAzureCosmosDb {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (!this.isLoaded) {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=CosmosDb`);
        }

        this.isLoaded = true;

    }
}

// @ts-check

class dataSourceNew extends wizardPage {

    constructor() {
        super('DataSourceView', '/dataSources/new/engines');

        this.dataSourceAzureSql = new dataSourceAzureSql();
        this.dataSourceAzureDataLakeV2 = new dataSourceAzureDataLakeV2();
        this.dataSourceAzureCosmosDb = new dataSourceAzureCosmosDb();
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

                        if (type.toString().toLowerCase() == 'cosmosdb')
                            await this.dataSourceAzureCosmosDb.loadAsync(engineId, this.htmlFieldPrefix, this.$properties);

                    }

                } catch (e) {

                    this.$smartWizard.smartWizard("goToStep", 0);
                }

                this.$spinner?.hide();

            }
        });


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

        if (!this.isLoaded) {
            await element.loadAsync(`/entities/new/entities?dvt=AzureSqlTable&engineId=${engineId}`);
        }

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

        if (!this.isLoaded) {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }

        this.isLoaded = true;
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

        if (!this.isLoaded) {
            await element.loadAsync(`/entities/new/entities?dvt=DelimitedText&engineId=${engineId}`);
        }

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
        this.isLoaded = true;
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
            dataSources = dataSourcesJson.map(item => item.name);

            $.each(dataSources, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item, text: item }));
            });

            r = await fetch(`/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureBlobFS`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }
            dataSourcesJson = await r.json();
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

        var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();


        let directories = [];
        try {

            let r = await fetch(`/api/storages/${engineId}/containers/${dataSourceSelected}`);

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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIkNsaWVudFNyYy9yb3V0ZXIuanMiLCJDbGllbnRTcmMvZGFzaGJvYXJkL2Rhc2hib2FyZFBhZ2UuanMiLCJDbGllbnRTcmMvZW5naW5lcy9lbmdpbmVzUGFnZS5qcyIsIkNsaWVudFNyYy9tb2RhbC9tb2RhbFBhbmVsLmpzIiwiQ2xpZW50U3JjL2NvbnNvbGUyLmpzIiwiQ2xpZW50U3JjL2hlbHBlcnMuanMiLCJDbGllbnRTcmMvaGFuZGxlcnMuanMiLCJDbGllbnRTcmMvbm90aWZpY2F0aW9uLmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxEZWxldGVFbmdpbmUuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbFJlc291cmNlR3JvdXAuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFicmlja3MuanMiLCJDbGllbnRTcmMvbW9kYWwvbW9kYWxQYW5lbERhdGFGYWN0b3J5LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxQcmV2aWV3LmpzIiwiQ2xpZW50U3JjL21vZGFsL21vZGFsUGFuZWxVc2Vycy5qcyIsIkNsaWVudFNyYy9tb2RhbC9tb2RhbFBhbmVsRXJyb3IuanMiLCJDbGllbnRTcmMvZW5naW5lcy9lbmdpbmVEZXRhaWxzUGFnZS5qcyIsIkNsaWVudFNyYy9kb3RtaW10YWJsZS5qcyIsIkNsaWVudFNyYy9hZG1pbi9hZG1pblBhZ2UuanMiLCJDbGllbnRTcmMvYWRtaW4vYWRtaW5EZXBsb3ltZW50RW5naW5lUGFnZS5qcyIsIkNsaWVudFNyYy9hZG1pbi9hZG1pbkVuZ2luZVJlcXVlc3REZXRhaWxzUGFnZS5qcyIsIkNsaWVudFNyYy9tZ3QuanMiLCJDbGllbnRTcmMvYXV0aC5qcyIsIkNsaWVudFNyYy9ob21lL2hvbWVQYWdlLmpzIiwiQ2xpZW50U3JjL3NldHRpbmdzL3NldHRpbmdzUGFnZS5qcyIsIkNsaWVudFNyYy9ib290c3RyYXBUYWJsZXMvZW5naW5lQm9vdHN0cmFwVGFibGUuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZXNQYWdlLmpzIiwiQ2xpZW50U3JjL3dpemFyZC93aXphcmRQYWdlLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZVNxbC5qcyIsIkNsaWVudFNyYy9kYXRhU291cmNlcy9kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VBenVyZUNvc21vc0RiLmpzIiwiQ2xpZW50U3JjL2RhdGFTb3VyY2VzL2RhdGFTb3VyY2VOZXcuanMiLCJDbGllbnRTcmMvZGF0YVNvdXJjZXMvZGF0YVNvdXJjZUVkaXQuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNQYWdlLmpzIiwiQ2xpZW50U3JjL2VudGl0aWVzL2VudGl0aWVzQXp1cmVTcWwuanMiLCJDbGllbnRTcmMvZW50aXRpZXMvZW50aXRpZXNEZWxpbWl0ZWRUZXh0LmpzIiwiQ2xpZW50U3JjL2VudGl0aWVzL2VudGl0aWVzTmV3UGFnZS5qcyIsIkNsaWVudFNyYy9leHRlbnNpb25zLmpzIiwiQ2xpZW50U3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIu+7vy8vIEB0cy1jaGVjayBcclxuXHJcbmV4cG9ydCBjbGFzcyByb3V0ZXIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMubWFwID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFF1ZXJ5UGFyYW1ldGVycyA9IG5ldyBNYXAoKTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgKHBzZSkgPT4gdGhpcy5fb25Mb2NhdGlvbkNoYW5nZShwc2UpKTtcclxuXHJcbiAgICAgICAgdGhpcy5faW5pdChsb2NhdGlvbi5ocmVmKTtcclxuXHJcbiAgICAgICAgLy8gY2FsbGVkIGV2ZXJ5IHRpbWUgdGhlIGRvY3VtZW50IGlzIHJlYWR5XHJcbiAgICAgICAgLy8gZXZlbnQgYWZ0ZXIgYW4gaGlzdG9yeSBjYWxsYmFjayB3aGl0aCBwb3BzdGF0ZVxyXG4gICAgICAgICQoKCkgPT4gdGhpcy5fcnVuKCkpO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGdldCB0aGUgY3VycmVudCB2aWV3IG5hbWUgKHRoZSAve1ZpZXd9IG5hbWUgcGFnZSlcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudFZpZXcoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcmV0dXJucyB7e1tdfX0gZ2V0IHRoZSBxdWVyeSBwYXJhbWV0ZXJzXHJcbiAgICAgKi9cclxuICAgIGdldFF1ZXJ5UGFyYW1ldGVycygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UXVlcnlQYXJhbWV0ZXJzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEByZXR1cm5zIHtVUkx9IGdldCB0aGUgY3VycmVudCB1cmxcclxuICAgICAqL1xyXG4gICAgZ2V0Q3VycmVudFVybCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50VXJsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHJldHVybnMge29iamVjdH0gZ2V0IHRoZSBjdXJyZW50IHN0YXRlICh1c2VseSBhZnRlciBhIHBvc3QsIGFuZCBkZWNsYXJlZCBmcm9tIHRoZSBub2RlIHZpZXcgaW4ge3N0YXRlfSBvYmplY3QpXHJcbiAgICAgKi9cclxuICAgIGdldEN1cnJlbnRTdGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGU7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogaW5pdCB0aGUgcm91dGVyIG9uIGVhY2ggdXJsIHJlcXVlc3RlZFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGxvYyBjdXJyZW50IGxvY2F0aW9uIGhyZWZcclxuICAgICAqL1xyXG4gICAgX2luaXQobG9jKSB7XHJcbiAgICAgICAgLy90aGlzLmN1cnJlbnRVcmwgPSBuZXcgdXJpanMobG9jKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRVcmwgPSBuZXcgVVJMKGxvYyk7XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgY3VycmVudCB2aWV3XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VmlldyA9IHRoaXMuY3VycmVudFVybC5wYXRobmFtZTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBxdWVyeSBwYXJhbWV0ZXJzXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VXJsLnNlYXJjaFBhcmFtcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFF1ZXJ5UGFyYW1ldGVycy5zZXQoa2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICogQHBhcmFtIHtQb3BTdGF0ZUV2ZW50fSBwb3BTdGF0ZUV2ZW50IFxyXG4gICAgKi9cclxuICAgIF9vbkxvY2F0aW9uQ2hhbmdlKHBvcFN0YXRlRXZlbnQpIHtcclxuICAgICAgICB2YXIgc3JjRWxlbSA9IHBvcFN0YXRlRXZlbnQuc3JjRWxlbWVudDtcclxuXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmICghc3JjRWxlbSB8fCAhc3JjRWxlbS5sb2NhdGlvbilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSAmJiB0aGlzLmN1cnJlbnRQYWdlLm9uVW5sb2FkKVxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlLm9uVW5sb2FkKCk7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLl9pbml0KHNyY0VsZW0ubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgdGhpcy5fcnVuKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIF9jcmVhdGVJbnN0YW5jZShjb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIHZhciBmYWN0b3J5ID0gY29uc3RydWN0b3IuYmluZC5hcHBseShjb25zdHJ1Y3RvciwgYXJndW1lbnRzKTtcclxuICAgICAgICByZXR1cm4gbmV3IGZhY3RvcnkoKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IFtzdGF0ZV0gXHJcbiAgICAgKi9cclxuICAgIG5hdmlnYXRlVG8odXJsLCBzdGF0ZSkge1xyXG5cclxuICAgICAgICBpZiAodXJsID09PSB0aGlzLmN1cnJlbnRVcmwucGF0aG5hbWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHN0YXRlID8gc3RhdGUgOiB7fSwgXCJcIiwgdXJsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGhOYW1lIDogcGF0aG5hbWUgdXJpXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYWdlSGFuZGxlclxyXG4gICAgKi9cclxuICAgIHJlZ2lzdGVyKHBhdGhOYW1lLCBwYWdlSGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMubWFwLnNldChwYXRoTmFtZSwgcGFnZUhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIF9ydW4oKSB7XHJcblxyXG4gICAgICAgIGlmICghJClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9ICQoXCIjcm91dGVyU3RhdGVcIikudmFsKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRTdGF0ZSlcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBKU09OLnBhcnNlKHRoaXMuY3VycmVudFN0YXRlKTtcclxuXHJcbiAgICAgICAgbGV0IGN1cnJlbnRLZXk7XHJcblxyXG4gICAgICAgIHRoaXMubWFwLmZvckVhY2goKHYsIGspID0+IHtcclxuICAgICAgICAgICAgdmFyIHIgPSBuZXcgUmVnRXhwKGssICdpJyk7XHJcbiAgICAgICAgICAgIGxldCBpc01hdGNoID0gci50ZXN0KHRoaXMuY3VycmVudFZpZXcpO1xyXG4gICAgICAgICAgICBpZiAoaXNNYXRjaClcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRLZXkgPSBrO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGlmICghY3VycmVudEtleSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgY3VycmVudFBhZ2VDdG9yID0gdGhpcy5tYXAuZ2V0KGN1cnJlbnRLZXkpO1xyXG5cclxuICAgICAgICBpZiAoIWN1cnJlbnRQYWdlQ3RvcilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy5fY3JlYXRlSW5zdGFuY2UoY3VycmVudFBhZ2VDdG9yKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmN1cnJlbnRQYWdlKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlLm9uTG9hZCkge1xyXG4gICAgICAgICAgICAkKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2Uub25Mb2FkKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyb3V0ZXIgaGFzIGxvYWRlZCBwYWdlIFwiICsgdGhpcy5jdXJyZW50Vmlldyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2Uub25VbmxvYWQpIHtcclxuICAgICAgICAgICAgJCh3aW5kb3cpLm9uKCdiZWZvcmV1bmxvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlLm9uVW5sb2FkKClcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8vIHNpbmdsZXRvblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgcm91dGVyKCk7XHJcblxyXG5cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4uL3JvdXRlci5qc1wiO1xyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBkYXNoYm9hcmRQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcGFnZUluZGV4IGdldCB0aGUgY3VycmVudCBwYWdlIGluZGV4XHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlZnJlc2gocGFnZUluZGV4KSB7XHJcbiAgICB9XHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgY2xhc3MgZW5naW5lc1BhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoaWQpIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5fc2hvd25QYW5lbCA9IChlKSA9PiB7IH07XHJcbiAgICAgICAgdGhpcy5fc2hvd1BhbmVsID0gKGUpID0+IHsgfTtcclxuICAgICAgICB0aGlzLl91bmxvYWRQYW5lbCA9IChlKSA9PiB7IH07XHJcbiAgICAgICAgdGhpcy5fbGFyZ2UgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gXCJyaWdodFwiO1xyXG4gICAgICAgIHRoaXMuX2NlbnRlciA9IFwiXCI7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGdlbmVyYXRlKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wYW5lbCgpICYmIHRoaXMucGFuZWwoKS5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuXHJcbiAgICAgICAgbGV0IG1vZGFsSHRtbERpdiA9IHRoaXMuX2dlbmVyYXRlTW9kYWxIdG1sKCk7XHJcbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChtb2RhbEh0bWxEaXYpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgc20oKSB7XHJcbiAgICAgICAgdGhpcy5fbGFyZ2UgPSBcIlwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbGcoKSB7XHJcbiAgICAgICAgdGhpcy5fbGFyZ2UgPSBcIiBtb2RhbC1sZ1wiO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICB4bCgpIHtcclxuICAgICAgICB0aGlzLl9sYXJnZSA9IFwiIG1vZGFsLXhsXCI7XHJcbiAgICAgICAgdGhpcy5fcG9zaXRpb24gPSBcIlwiO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgcmVhZG9ubHkoKSB7XHJcbiAgICAgICAgdGhpcy5fZGF0YV9yZWFkb25seSA9ICdkYXRhLWJhY2tkcm9wPVwic3RhdGljXCIgZGF0YS1rZXlib2FyZD1cImZhbHNlXCIgJztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjZW50ZXIoKSB7XHJcbiAgICAgICAgdGhpcy5fY2VudGVyID0gXCJtb2RhbC1kaWFsb2ctY2VudGVyZWQgbW9kYWwtZGlhbG9nLXNjcm9sbGFibGVcIjtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25TaG93bihzaG93blBhbmVsRXZlbnQpIHsgdGhpcy5wYW5lbCgpLm9uKCdzaG93bi5icy5tb2RhbCcsIHNob3duUGFuZWxFdmVudCkgfVxyXG5cclxuICAgIG9uU2hvdyhzaG93UGFuZWxFdmVudCkgeyB0aGlzLnBhbmVsKCkub24oJ3Nob3cuYnMubW9kYWwnLCBzaG93UGFuZWxFdmVudCkgfVxyXG5cclxuICAgIG9uVW5Mb2FkKHVubG9hZFBhbmVsRXZlbnQpIHsgdGhpcy5wYW5lbCgpLm9uKCdoaWRlLmJzLm1vZGFsJywgdW5sb2FkUGFuZWxFdmVudCkgfVxyXG5cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MRWxlbWVudD59ICovXHJcbiAgICBwYW5lbCgpIHsgcmV0dXJuICQoYCMke3RoaXMuaWR9YCkgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7SlF1ZXJ5PEhUTUxCdXR0b25FbGVtZW50Pn0gKi9cclxuICAgIHN1Ym1pdEJ1dHRvbigpIHsgcmV0dXJuICQoYCMke3RoaXMuaWR9U3VibWl0QnV0dG9uYCkgfVxyXG5cclxuICAgIC8qKiAgQHJldHVybnMge0pRdWVyeTxIVE1MQnV0dG9uRWxlbWVudD59ICovXHJcbiAgICBkZWxldGVCdXR0b24oKSB7XHJcbiAgICAgICAgcmV0dXJuICQoYCMke3RoaXMuaWR9RGVsZXRlQnV0dG9uYClcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVCdXR0b25UZXh0KHRleHQpIHtcclxuICAgICAgICAkKGAjJHt0aGlzLmlkfURlbGV0ZUJ1dHRvblRleHRgKS50ZXh0KHRleHQpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MQnV0dG9uRWxlbWVudD59Ki9cclxuICAgIGNsb3NlQnV0dG9uKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1DbG9zZUJ1dHRvbmApIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMge0pRdWVyeTxIVE1MRGl2RWxlbWVudD59Ki9cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGJvZHkoKSB7IHJldHVybiAkKGAjJHt0aGlzLmlkfUJvZHlgKSB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIHtKUXVlcnk8SFRNTEhSRWxlbWVudD59Ki9cclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRpdGxlKCkgeyByZXR1cm4gJChgIyR7dGhpcy5pZH1UaXRsZWApIH1cclxuXHJcblxyXG4gICAgX2dlbmVyYXRlTW9kYWxIdG1sKCkge1xyXG5cclxuICAgICAgICBsZXQgbW9kYWwgPSBgXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsICR7dGhpcy5fcG9zaXRpb259IGZhZGVcIiBpZD1cIiR7dGhpcy5pZH1cIiB0YWJpbmRleD1cIi0xXCIgJHt0aGlzLl9kYXRhX3JlYWRvbmx5fWFyaWEtbGFiZWxsZWRieT1cIiR7dGhpcy5pZH1cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZyR7dGhpcy5fbGFyZ2V9ICR7dGhpcy5fY2VudGVyfVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnQke3RoaXMuX2xhcmdlfVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGg1IGNsYXNzPVwibW9kYWwtdGl0bGVcIiBpZD1cIiR7dGhpcy5pZH1UaXRsZVwiPjwvaDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+JnRpbWVzOzwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIiBpZD1cIiR7dGhpcy5pZH1Cb2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWZvb3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGFyayBidG4tc21cIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIGlkPVwiJHt0aGlzLmlkfUNsb3NlQnV0dG9uXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzcz1cImZhcyBmYS11bmRvXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2xvc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1zbVwiIGlkPVwiJHt0aGlzLmlkfVN1Ym1pdEJ1dHRvblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtc2F2ZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN1Ym1pdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRhbmdlciBidG4tc21cIiBpZD1cIiR7dGhpcy5pZH1EZWxldGVCdXR0b25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLXRyYXNoLWFsdFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGlkPVwiJHt0aGlzLmlkfURlbGV0ZUJ1dHRvblRleHRcIj5EZWxldGU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PmA7XHJcblxyXG4gICAgICAgIHJldHVybiBtb2RhbDtcclxuICAgIH1cclxuXHJcbn1cclxuIiwi77u/XHJcblxyXG5leHBvcnQgY2xhc3MgY29uc29sZTIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtKUXVlcnk8SFRNTERpdkVsZW1lbnQ+fSBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRGl2RWxlbWVudD59IHBhcmVudE92ZXJmbG93RWxlbWVudFxyXG4gICAgICoqL1xyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudCwgcGFyZW50T3ZlcmZsb3dFbGVtZW50ID0gbnVsbCkge1xyXG5cclxuICAgICAgICB0aGlzLl9jb25zb2xlMiA9IGVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50ID0gcGFyZW50T3ZlcmZsb3dFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50KVxyXG4gICAgICAgICAgICB0aGlzLl9pbml0aWFsVG9wID0gdGhpcy5fcGFyZW50T3ZlcmZsb3dFbGVtZW50LnBvc2l0aW9uKCkudG9wO1xyXG5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgd2luZG93LlByaXNtID0gd2luZG93LlByaXNtIHx8IHt9O1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB3aW5kb3cuUHJpc20ubWFudWFsID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWd0bG9naW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWd0bG9naW4nKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgX3VzZXJOYW1lKCkge1xyXG5cclxuICAgICAgICBsZXQgdXNlck5hbWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbWd0bG9naW4gJiYgdGhpcy5fbWd0bG9naW4udXNlckRldGFpbHMpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBtYWlsID0gdGhpcy5fbWd0bG9naW4udXNlckRldGFpbHMuZW1haWw7XHJcbiAgICAgICAgICAgIGlmICghbWFpbClcclxuICAgICAgICAgICAgICAgIG1haWwgPSB0aGlzLl9tZ3Rsb2dpbi51c2VyRGV0YWlscy51c2VyUHJpbmNpcGFsTmFtZTtcclxuXHJcbiAgICAgICAgICAgIGxldCBuYW1lTWF0Y2ggPSBtYWlsLm1hdGNoKC9eKFteQF0qKUAvKTtcclxuICAgICAgICAgICAgdXNlck5hbWUgPSBuYW1lTWF0Y2ggPyBuYW1lTWF0Y2hbMV0gOiBcIlwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVzZXJOYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIF9zY3JvbGxUb0VuZCgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3BhcmVudE92ZXJmbG93RWxlbWVudClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBsZXQgaGVpZ2h0ID0gdGhpcy5fY29uc29sZTIuaGVpZ2h0KCk7XHJcbiAgICAgICAgdmFyIG5ld1BvcyA9IHRoaXMuX2luaXRpYWxUb3AgKyBoZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuX3BhcmVudE92ZXJmbG93RWxlbWVudC5zY3JvbGxUbyhuZXdQb3MsIDEwMCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLl9jb25zb2xlMi5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGVuZE9iamVjdChqc29uT2JqZWN0KSB7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBsZXQganNvblN0cmluZyA9IFByaXNtLmhpZ2hsaWdodChKU09OLnN0cmluZ2lmeShqc29uT2JqZWN0LCBudWxsLCAyKSwgUHJpc20ubGFuZ3VhZ2VzLmpzb24sICdqc29uJyk7XHJcblxyXG4gICAgICAgIGxldCBzdHIgPSBcIjxwcmUgY2xhc3M9J21sLTMgbXItMyBtdC0zJyBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjp3aGl0ZTt3aGl0ZS1zcGFjZTpwcmUtd3JhcDt3aWR0aDo5MCU7bWF4LWhlaWdodDoyNTBweDsnPjxjb2RlPlwiO1xyXG4gICAgICAgIHN0ciArPSBqc29uU3RyaW5nO1xyXG4gICAgICAgIHN0ciArPSBcIjwvY29kZT48L3ByZT5cIjtcclxuXHJcbiAgICAgICAgdGhpcy5fY29uc29sZTIuYXBwZW5kKHN0cik7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9FbmQoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhcHBlbmRXYXJuaW5nKGxpbmUpIHtcclxuXHJcbiAgICAgICAgbGV0IHN0ciA9IGA8ZGl2IGNsYXNzPVwiZC1mbGV4IGZsZXgtcm93XCI+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC13YXJuaW5nXCI+JHt0aGlzLl91c2VyTmFtZSgpfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+Ojwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdhcm5pbmdcIj5+JCZuYnNwOzwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+JHtsaW5lfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgdGhpcy5fY29uc29sZTIuYXBwZW5kKHN0cik7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9FbmQoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXBwZW5kRXJyb3IobGluZSkge1xyXG5cclxuICAgICAgICBsZXQgc3RyID0gYDxkaXYgY2xhc3M9XCJkLWZsZXggZmxleC1yb3dcIj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LWRhbmdlclwiPiR7dGhpcy5fdXNlck5hbWUoKX08L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC13aGl0ZVwiPjo8L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC1kYW5nZXJcIj5+JCZuYnNwOzwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSBgPHNwYW4gY2xhc3M9XCJ0ZXh0LXdoaXRlXCI+JHtsaW5lfTwvc3Bhbj5gO1xyXG4gICAgICAgIHN0ciArPSAnPC9kaXY+JztcclxuXHJcbiAgICAgICAgdGhpcy5fY29uc29sZTIuYXBwZW5kKHN0cik7XHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVG9FbmQoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgbG9nKGxpbmUpIHsgdGhpcy5hcHBlbmRMaW5lKGxpbmUpOyB9XHJcbiAgICBpbmZvKGxpbmUpIHsgdGhpcy5hcHBlbmRMaW5lKGxpbmUpOyB9XHJcbiAgICBlcnJvcihsaW5lKSB7IHRoaXMuYXBwZW5kRXJyb3IobGluZSk7IH1cclxuICAgIHdhcm4obGluZSkgeyB0aGlzLmFwcGVuZFdhcm5pbmcobGluZSk7IH1cclxuXHJcblxyXG4gICAgYXBwZW5kTGluZShsaW5lKSB7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBzdHIgPSBgPGRpdiBjbGFzcz1cImQtZmxleCBmbGV4LXJvd1wiPmA7XHJcbiAgICAgICAgc3RyICs9IGA8c3BhbiBjbGFzcz1cInRleHQtc3VjY2Vzc1wiPiR7dGhpcy5fdXNlck5hbWUoKX08L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC13aGl0ZVwiPjo8L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC1zdWNjZXNzXCI+fiQmbmJzcDs8L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gYDxzcGFuIGNsYXNzPVwidGV4dC13aGl0ZVwiPiR7bGluZX08L3NwYW4+YDtcclxuICAgICAgICBzdHIgKz0gJzwvZGl2Pic7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbnNvbGUyLmFwcGVuZChzdHIpO1xyXG4gICAgICAgIHRoaXMuX3Njcm9sbFRvRW5kKCk7XHJcbiAgICB9XHJcblxyXG5cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KG1zKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIG1zKSk7XHJcbn1cclxuXHJcbi8vZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZSgpIHtcclxuLy8gICAgdGhpcy5yZW1vdmVDbGFzcygnZGlzYWJsZWQnKTtcclxuLy8gICAgdGhpcy5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKTtcclxuLy99XHJcbi8vZXhwb3J0IGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbi8vICAgIHRoaXMuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbi8vICAgIHRoaXMucHJvcCgnZGlzYWJsZWQnLCB0cnVlKTtcclxuXHJcbi8vfVxyXG5cclxuLy8vKipcclxuLy8gKiBAcGFyYW0ge3N0cmluZ30gZGF0YV91cmxcclxuLy8gKiBAcGFyYW0ge0pRdWVyeTxIVE1MRWxlbWVudD59IGVsZW1lbnRcclxuLy8gKi9cclxuLy9leHBvcnQgZnVuY3Rpb24gbG9hZFBhcnRpYWxBc3luYyhkYXRhX3VybCwgZWxlbWVudCkge1xyXG4vLyAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4vLyAgICAgICAgZWxlbWVudC5sb2FkKGRhdGFfdXJsLCAocmVzcG9uc2UsIHN0YXR1cywgeGhyKSA9PiB7XHJcbi8vICAgICAgICAgICAgaWYgKHN0YXR1cyA9PSBcImVycm9yXCIpIHtcclxuLy8gICAgICAgICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcclxuLy8gICAgICAgICAgICB9XHJcbi8vICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XHJcbi8vICAgICAgICB9KTtcclxuLy8gICAgfSk7XHJcbi8vfVxyXG4iLCLvu78vLyBAdHMtY2hlY2tcclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIGhhbmRsZXJzIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLm1ldGhvZHMgPSB7fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZVxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV3TWV0aG9kXHJcbiAgICAgKi9cclxuICAgIG9uKG1ldGhvZE5hbWUsIG5ld01ldGhvZCkge1xyXG4gICAgICAgIGlmICghbWV0aG9kTmFtZSB8fCAhbmV3TWV0aG9kKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG1ldGhvZE5hbWUgPSBtZXRob2ROYW1lLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIGhhbmRsZXJzIGFscmVhZHksIGNyZWF0ZSBhbiBlbXB0eSBhcnJheVxyXG4gICAgICAgIGlmICghdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdKSB7XHJcbiAgICAgICAgICAgIHRoaXMubWV0aG9kc1ttZXRob2ROYW1lXSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUHJldmVudGluZyBhZGRpbmcgdGhlIHNhbWUgaGFuZGxlciBtdWx0aXBsZSB0aW1lcy5cclxuICAgICAgICBpZiAodGhpcy5tZXRob2RzW21ldGhvZE5hbWVdLmluZGV4T2YobmV3TWV0aG9kKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRkIHRoZSBtZXRob2QgdG8gdGhlIGhhbmRsZXIgbGlzdFxyXG4gICAgICAgIHRoaXMubWV0aG9kc1ttZXRob2ROYW1lXS5wdXNoKG5ld01ldGhvZCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5yZWdpc3RlciBhbiBoYW5kbGVyXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZSBtZXRob2QgbmFtZVxyXG4gICAgICogQHBhcmFtIHthbnl9IG1ldGhvZCAoLi4uYXJnczogYW55W10pID0+IHZvaWRcclxuICAgICAqL1xyXG4gICAgb2ZmKG1ldGhvZE5hbWUsIG1ldGhvZCkge1xyXG4gICAgICAgIGlmICghbWV0aG9kTmFtZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtZXRob2ROYW1lID0gbWV0aG9kTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAvLyBnZXQgYWxsIGhhbmRsZXJzIHdpdGggdGhpcyBtZXRob2QgbmFtZVxyXG4gICAgICAgIGNvbnN0IGhhbmRsZXJzID0gdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdO1xyXG5cclxuICAgICAgICAvLyBpZiBoYW5kbGVycyBkbyBub3QgZXhpc3RzLCByZXR1cm5cclxuICAgICAgICBpZiAoIWhhbmRsZXJzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYSBmdW5jdGlvbiBleGlzdGluZ1xyXG4gICAgICAgIGlmIChtZXRob2QpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXggaW4gYWxsIGhhbmRsZXJzXHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZUlkeCA9IGhhbmRsZXJzLmluZGV4T2YobWV0aG9kKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIHdlIGZvdW5kIGl0LCBtYWtlIGEgc3BsaWNlIGluIHRoZSBoYW5kbGVycyBsaXN0XHJcbiAgICAgICAgICAgIGlmIChyZW1vdmVJZHggIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVycy5zcGxpY2UocmVtb3ZlSWR4LCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpZiBubyBtb3JlIGhhbmRsZXJzLCBkZWxldGVcclxuICAgICAgICAgICAgICAgIGlmIChoYW5kbGVycy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5tZXRob2RzW21ldGhvZE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMubWV0aG9kc1ttZXRob2ROYW1lXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldCAgIFxyXG4gICAgICovXHJcbiAgICBpbnZva2UodGFyZ2V0LCAuLi5wYXJhbWV0ZXJzKSB7XHJcblxyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgbWV0aG9kcyBhcnJheSB0byBpbnZva2VcclxuICAgICAgICBjb25zdCBtZXRob2RzID0gdGhpcy5tZXRob2RzW3RhcmdldC50b0xvd2VyQ2FzZSgpXTtcclxuXHJcbiAgICAgICAgLy8gaWYgd2UgaGF2ZSBhdCBsZWFzdCBvbiBtZXRob2QgaW4gdGhlIG1ldGhvZHMgYXJyYXkgdG8gaW52b2tlXHJcbiAgICAgICAgaWYgKG1ldGhvZHMpIHtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBtIG9mIG1ldGhvZHMpIHtcclxuICAgICAgICAgICAgICAgICAgICBtLmFwcGx5KF90aGlzLCBwYXJhbWV0ZXJzKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgQSBjYWxsYmFjayBmb3IgdGhlIG1ldGhvZCAke3RhcmdldC50b0xvd2VyQ2FzZSgpfSB0aHJldyBlcnJvciAnJHtlfScuYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYE5vIGNsaWVudCBtZXRob2Qgd2l0aCB0aGUgbmFtZSAnJHt0YXJnZXQudG9Mb3dlckNhc2UoKX0nIGZvdW5kLmApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuIiwi77u/Ly8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3d3d3Jvb3QvbGliL3NpZ25hbHIvZGlzdC9icm93c2VyL3NpZ25hbHIuanNcIiAvPlxyXG5cclxuaW1wb3J0IHsgZGVsYXkgfSBmcm9tIFwiLi9oZWxwZXJzLmpzXCI7XHJcbmltcG9ydCB7IGhhbmRsZXJzIH0gZnJvbSBcIi4vaGFuZGxlcnMuanNcIlxyXG5cclxuLy8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgY2xhc3Mgbm90aWZpY2F0aW9uIHtcclxuXHJcbiAgICAvLyBzaW5nbGV0b25cclxuICAgIHN0YXRpYyBfY3VycmVudDtcclxuXHJcbiAgICAvKiogQHJldHVybnMge25vdGlmaWNhdGlvbn0gKi9cclxuICAgIHN0YXRpYyBnZXQgY3VycmVudCgpIHtcclxuICAgICAgICBpZiAoIW5vdGlmaWNhdGlvbi5fY3VycmVudClcclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLl9jdXJyZW50ID0gbmV3IG5vdGlmaWNhdGlvbigpO1xyXG5cclxuICAgICAgICByZXR1cm4gbm90aWZpY2F0aW9uLl9jdXJyZW50O1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLy8gZXZlbnRzXHJcbiAgICBzdGF0aWMgT25TdGFydGVkID0gXCJPblN0YXJ0ZWRcIjtcclxuICAgIHN0YXRpYyBPblN0b3BwZWQgPSBcIk9uU3RvcHBlZFwiO1xyXG4gICAgc3RhdGljIE9uQ29ubmVjdGVkID0gXCJPbkNvbm5lY3RlZFwiO1xyXG4gICAgc3RhdGljIE9uQ29ubmVjdGluZyA9IFwiT25Db25uZWN0aW5nXCI7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZXJzID0gbmV3IGhhbmRsZXJzKCk7XHJcbiAgICAgICAgdGhpcy5faXNDb25uZWN0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9pc1N0YXJ0aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG5ldyBzaWduYWxSLkh1YkNvbm5lY3Rpb25CdWlsZGVyKClcclxuICAgICAgICAgICAgLmNvbmZpZ3VyZUxvZ2dpbmcoc2lnbmFsUi5Mb2dMZXZlbC5Ob25lKVxyXG4gICAgICAgICAgICAud2l0aFVybCgnL25vdGlmaWNhdGlvbnMnKVxyXG4gICAgICAgICAgICAud2l0aEF1dG9tYXRpY1JlY29ubmVjdCgpXHJcbiAgICAgICAgICAgIC5jb25maWd1cmVMb2dnaW5nKHNpZ25hbFIuTG9nTGV2ZWwuVHJhY2UpXHJcbiAgICAgICAgICAgIC5idWlsZCgpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub25yZWNvbm5lY3RpbmcoZXJyb3IgPT4gdGhpcy5fY29uc29sZS5sb2coZXJyb3IpKTtcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24ub25jbG9zZShlcnJvciA9PiB0aGlzLm9uQ29ubmVjdGlvbkVycm9yKGVycm9yKSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29ubmVjdGlvbi5vbihcImNvbm5lY3RlZFwiLCAoXykgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZXJzLmludm9rZShub3RpZmljYXRpb24uT25Db25uZWN0ZWQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzdGFydCgpIHtcclxuICAgICAgICBsZXQgcmV0cnlDb3VudCA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc1N0YXJ0aW5nKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuX2lzU3RhcnRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICB3aGlsZSAoIXRoaXMuX2lzQ29ubmVjdGVkICYmIHJldHJ5Q291bnQgPCA1KSB7XHJcblxyXG4gICAgICAgICAgICByZXRyeUNvdW50Kys7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNDb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uLnN0YXRlID09IHNpZ25hbFIuSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGFuZGxlcnMuaW52b2tlKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RpbmcpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uLnN0YXJ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGF3YWl0IGRlbGF5KDE1MDApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzQ29ubmVjdGVkKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9pc0Nvbm5lY3RlZCB8fCByZXRyeUNvdW50ID49IDUpIHtcclxuICAgICAgICAgICAgdGhpcy5faXNTdGFydGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUb28gbWFueSB0cmllcyB0byBjb25uZWN0XCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faGFuZGxlcnMuaW52b2tlKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBzdG9wKCkge1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25uZWN0aW9uLnN0YXRlICE9IHNpZ25hbFIuSHViQ29ubmVjdGlvblN0YXRlLkRpc2Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLmNvbm5lY3Rpb24uc3RvcCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5pbnZva2Uobm90aWZpY2F0aW9uLk9uU3RvcHBlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0Nvbm5lY3RlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lzU3RhcnRpbmcgPSBmYWxzZTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBoYW5kbGVyXHJcbiAgICAgKi9cclxuICAgIG9uKG1ldGhvZCwgaGFuZGxlcikge1xyXG4gICAgICAgIGlmIChtZXRob2QgPT0gbm90aWZpY2F0aW9uLk9uQ29ubmVjdGVkIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0aW5nIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25TdGFydGVkIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25TdG9wcGVkKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5vbihtZXRob2QsIGhhbmRsZXIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jb25uZWN0aW9uLm9uKG1ldGhvZCwgaGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2RcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGhhbmRsZXJcclxuICAgICAqL1xyXG4gICAgb2ZmKG1ldGhvZCwgaGFuZGxlcikge1xyXG4gICAgICAgIGlmIChtZXRob2QgPT0gbm90aWZpY2F0aW9uLk9uQ29ubmVjdGVkIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25Db25uZWN0aW5nIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25TdGFydGVkIHx8XHJcbiAgICAgICAgICAgIG1ldGhvZCA9PSBub3RpZmljYXRpb24uT25TdG9wcGVkKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVycy5vZmYobWV0aG9kLCBoYW5kbGVyKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29ubmVjdGlvbi5vZmYobWV0aG9kLCBoYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgb25Db25uZWN0aW9uRXJyb3IoZXJyb3IpIHtcclxuICAgICAgICBpZiAoZXJyb3IgJiYgZXJyb3IubWVzc2FnZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsIH0gZnJvbSBcIi4vbW9kYWxQYW5lbC5qc1wiO1xyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuLi9ub3RpZmljYXRpb24uanNcIlxyXG5cclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsRGVsZXRlRW5naW5lIHtcclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb2RhbFBhbmVsRGVsZXRlRW5naW5lKG1vZGFsX2RhdGFfdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RhbF9kYXRhX3RhcmdldCBtb2RhbCBhdHRyaWJ1dGUgZGF0YS10YXJnZXRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbF9kYXRhX3RhcmdldCA9IG1vZGFsX2RhdGFfdGFyZ2V0O1xyXG4gICAgICAgIC8vIEdldCB0aGUgc21hbGwgbW9kYWxcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLmxnKCkuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5jbGljayhhc3luYyAoZXZlbnQpID0+IHsgYXdhaXQgdGhpcy5kZWxldGVFbmdpbmVBc3luYyhldmVudCkgfSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2PiZuYnNwOzwvZGl2PlwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb25zb2xlJz48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSBKUXVlcnk8SFRNTERpdkVsZW1lbnQ+ICovXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZUVsZW1lbnQgPSB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5maW5kKCcuY29uc29sZScpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZSA9IG5ldyBjb25zb2xlMih0aGlzLmRlbGV0ZUNvbnNvbGVFbGVtZW50LCB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKSk7XHJcblxyXG4gICAgICAgIC8vIHN1YnNjcmliZSB0byBldmVudCBmcm9tIHNpZ25hbHIgYWJvdXQgZGVwbG95bWVudFxyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKFwiZGVwbG95XCIsIHRoaXMuYXBwZW5kRGVwbG95VG9Db25zb2xlLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdGFydGVkLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIHN0YXJ0ZWQuXCIpKTtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0aW5nLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RpbmcuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCwgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0b3BwZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgc3RvcHBlZC5cIikpO1xyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLCBhbmQgc2V0IGl0IGdsb2JhbHlcclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXF1ZXN0UmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlcXVlc3RSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICQobG9jYXRpb24pLmF0dHIoJ2hyZWYnLCAnL0FkbWluL0luZGV4Jyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXF1ZXN0ID0gYXdhaXQgZW5naW5lUmVxdWVzdFJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGltZW91dCBvZiB0aGUgcGFnZSBmb3Igc29tZSByZWFzb24gP1xyXG4gICAgICAgIGlmICghZW5naW5lUmVxdWVzdCkge1xyXG4gICAgICAgICAgICAkKGxvY2F0aW9uKS5hdHRyKCdocmVmJywgJy8nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5zaG93KCk7XHJcblxyXG4gICAgICAgICQoXCI8ZGl2IGNsYXNzPSdtLTInPkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgZW5naW5lIDxiPlwiICsgZW5naW5lUmVxdWVzdC5lbmdpbmVOYW1lICsgXCI8L2I+ID88L2Rpdj5cIikuaW5zZXJ0QmVmb3JlKHRoaXMuZGVsZXRlQ29uc29sZUVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShcIlJlYWR5IHRvIGRlbGV0ZS4gUGxlYXNlIHByZXNzICdEZWxldGUnIGJ1dHRvbiB0byBzdGFydC5cIik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7SlF1ZXJ5LkNsaWNrRXZlbnQ8SFRNTEJ1dHRvbkVsZW1lbnQsIG51bGwsIEhUTUxCdXR0b25FbGVtZW50LCBIVE1MQnV0dG9uRWxlbWVudD59IGV2dCAqL1xyXG4gICAgYXN5bmMgZGVsZXRlRW5naW5lQXN5bmMoZXZ0KSB7XHJcblxyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZW5naW5lSWQpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZEVycm9yKFwiVW5hYmxlIHRvIHJldHJpZXZlIHRoZSBlbmdpbmUgcmVxdWVzdCBpZC4uLi5cIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEdldCBub3RpZmljYXRpb24gaGVscGVyXHJcbiAgICAgICAgYXdhaXQgbm90aWZpY2F0aW9uLmN1cnJlbnQuc3RhcnQoKTtcclxuXHJcbiAgICAgICAgLy8gc3Vic2NyaWJlIHRvIHRoaXMgZGVwbG95bWVudCAoZm9yIHRoaXMgdXNlcilcclxuICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5lbmdpbmVJZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKFwiV2FpdGluZyBmb3IgYW4gYWdlbnQgdG8gZW5xdWV1ZSB0aGUgZW5naW5lIGRyb3Agb3BlcmF0aW9uLi4uXCIpO1xyXG5cclxuICAgICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcclxuICAgICAgICBsZXQgdXJsRGVsZXRpb24gPSBgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gO1xyXG5cclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmxEZWxldGlvbiwgeyBtZXRob2Q6ICdERUxFVEUnIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kRXJyb3IoYFVuYWJsZSB0byBkZWxldGUgdGhlIGVuZ2luZSByZXF1ZXN0IHdpdGggSWQgJHt0aGlzLmVuZ2luZUlkfSBgKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGRyb3BFbmdpbmVTdGFydCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgYXdhaXQgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUoZHJvcEVuZ2luZVN0YXJ0KVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kRXJyb3IoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgXCJEcm9waW5nXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BwZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVsZXRlQ29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZWxldGVDb25zb2xlLmFwcGVuZFdhcm5pbmcoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbHVlKVxyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZUNvbnNvbGUuYXBwZW5kT2JqZWN0KHZhbHVlKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi9tb2RhbFBhbmVsLmpzXCI7XHJcbmltcG9ydCB7IGNvbnNvbGUyIH0gZnJvbSBcIi4uL2NvbnNvbGUyLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cCB7XHJcblxyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFJlc291cmNlR3JvdXAobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBzbWFsbCBtb2RhbFxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkubGcoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsRW5naW5lO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyByZW1vdmUgdW5lY2Vzc2FyeSBidXR0b25zXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2PiZuYnNwOzwvZGl2PlwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5hcHBlbmQoXCI8ZGl2IGNsYXNzPSdjb25zb2xlJz48L2Rpdj5cIik7XHJcblxyXG4gICAgICAgIC8qKiBAdHlwZSBKUXVlcnk8SFRNTERpdkVsZW1lbnQ+ICovXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuY29uc29sZUVsZW1lbnQgPSB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5maW5kKCcuY29uc29sZScpO1xyXG4gICAgICAgIHRoaXMuY29uc29sZSA9IG5ldyBjb25zb2xlMih0aGlzLmNvbnNvbGVFbGVtZW50LCB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEdldHRpbmcgaW5mb3JtYXRpb24uLi5gKVxyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIGVuZ2luZSByZXF1ZXN0IGlkLCBhbmQgc2V0IGl0IGdsb2JhbHlcclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gYnV0dG9uLmRhdGEoJ2VuZ2luZS1pZCcpXHJcblxyXG4gICAgICAgIGxldCBlbmdpbmVSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL2VuZ2luZXMvJHt0aGlzLmVuZ2luZUlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAoZW5naW5lUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZSA9IGF3YWl0IGVuZ2luZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGltZW91dCBvZiB0aGUgcGFnZSBmb3Igc29tZSByZWFzb24gP1xyXG4gICAgICAgIGlmICghZW5naW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBlbmdpbmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgUmVzb3VyY2UgZ3JvdXAgPHN0cm9uZz4ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX08L3N0cm9uZz4gLi4uYClcclxuXHJcbiAgICAgICAgbGV0IHJnUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9yZXNvdXJjZWdyb3Vwcy8ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJnUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgcmVzb3VyY2UgZ3JvdXAgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2VHcm91cCA9IGF3YWl0IHJnUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHJlc291cmNlR3JvdXApO1xyXG5cclxuICAgICAgICBsZXQgcmdMaW5rUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9yZXNvdXJjZWdyb3Vwcy8ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX0vbGlua2AsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgaWQ6IHJlc291cmNlR3JvdXAuaWQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJnTGlua1Jlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IHJlc291cmNlIGdyb3VwIGxpbmsuXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlc291cmNlR3JvdXBMaW5rID0gYXdhaXQgcmdMaW5rUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgQXp1cmUgcmVzb3VyY2UgZ3JvdXAgbGluayA6IDxhIGhyZWY9JHtyZXNvdXJjZUdyb3VwTGluay51cml9IHRhcmdldD1cIl9ibGFua1wiPiR7cmVzb3VyY2VHcm91cC5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRG9uZS5gKVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBlZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIG1vZGFsUGFuZWxEYXRhYnJpY2tzIHtcclxuXHJcblxyXG5cclxuICAgIHN0YXRpYyBpbml0aWFsaXplKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBtb2RhbFBhbmVsRGF0YWJyaWNrcyhtb2RhbF9kYXRhX3RhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxfZGF0YV90YXJnZXQgPSBtb2RhbF9kYXRhX3RhcmdldDtcclxuICAgICAgICAvLyBHZXQgdGhlIHNtYWxsIG1vZGFsXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZSA9IG5ldyBtb2RhbFBhbmVsKG1vZGFsX2RhdGFfdGFyZ2V0KS5sZygpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25TaG93bihlID0+IHRoaXMuc2hvd25QYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxFbmdpbmU7XHJcbiAgICB9XHJcblxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgc2hvd1BhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIC8vIHJlbW92ZSB1bmVjZXNzYXJ5IGJ1dHRvbnNcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS50aXRsZSgpLnRleHQodGl0bGVTdHJpbmcpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmFwcGVuZChcIjxkaXY+Jm5ic3A7PC9kaXY+XCIpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmFwcGVuZChcIjxkaXYgY2xhc3M9J2NvbnNvbGUnPjwvZGl2PlwiKTtcclxuXHJcbiAgICAgICAgLyoqIEB0eXBlIEpRdWVyeTxIVE1MRGl2RWxlbWVudD4gKi9cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgdGhpcy5jb25zb2xlRWxlbWVudCA9IHRoaXMubW9kYWxFbmdpbmUuYm9keSgpLmZpbmQoJy5jb25zb2xlJyk7XHJcbiAgICAgICAgdGhpcy5jb25zb2xlID0gbmV3IGNvbnNvbGUyKHRoaXMuY29uc29sZUVsZW1lbnQsIHRoaXMubW9kYWxFbmdpbmUuYm9keSgpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbi4uLmApXHJcblxyXG4gICAgICAgIC8vIEdldCB0aGUgZW5naW5lIHJlcXVlc3QgaWQsIGFuZCBzZXQgaXQgZ2xvYmFseVxyXG4gICAgICAgIHRoaXMuZW5naW5lSWQgPSBidXR0b24uZGF0YSgnZW5naW5lLWlkJylcclxuXHJcbiAgICAgICAgbGV0IGVuZ2luZVJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvZW5naW5lcy8ke3RoaXMuZW5naW5lSWR9YCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc0ludGVycnVwdGVkKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIC8vIGlmIGFueSBlcnJvciB0byByZXRyaWV2ZSBkYXRhLCBnbyBiYWNrIGhvbWUgcGFnZVxyXG4gICAgICAgIGlmIChlbmdpbmVSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBlbmdpbmUgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lID0gYXdhaXQgZW5naW5lUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICAvLyB0aW1lb3V0IG9mIHRoZSBwYWdlIGZvciBzb21lIHJlYXNvbiA/XHJcbiAgICAgICAgaWYgKCFlbmdpbmUpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBSZXNvdXJjZSBncm91cDogPHN0cm9uZz4ke2VuZ2luZS5yZXNvdXJjZUdyb3VwTmFtZX08L3N0cm9uZz4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRGF0YWJyaWNrcyB3b3Jrc3BhY2U6IDxzdHJvbmc+JHtlbmdpbmUuY2x1c3Rlck5hbWV9PC9zdHJvbmc+LmApXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEdldHRpbmcgaW5mb3JtYXRpb24gZnJvbSBBenVyZS4uLmApXHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZVJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvZGF0YWJyaWNrcy8ke2VuZ2luZS5pZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJlc291cmNlUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZGF0YWJyaWNrcyBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZSA9IGF3YWl0IHJlc291cmNlUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kT2JqZWN0KHJlc291cmNlKTtcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlTGlua1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvcmVzb3VyY2Vncm91cHMvJHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9L2xpbmtgLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGlkOiByZXNvdXJjZS5pZCB9KSxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VMaW5rUmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgcmVzb3VyY2UgbGluay5cIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcmVzb3VyY2VMaW5rID0gYXdhaXQgcmVzb3VyY2VMaW5rUmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgQXp1cmUgRGF0YWJyaWtzIHdvcmtzcGFjZSBsaW5rOiA8YSBocmVmPVwiJHtyZXNvdXJjZUxpbmsudXJpfVwiIHRhcmdldD1cIl9ibGFua1wiPiR7cmVzb3VyY2UubmFtZX08L2E+YClcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYERhdGFicmlja3Mgd29ya3NwYWNlIGxpbms6IDxhIGhyZWY9XCJodHRwczovLyR7cmVzb3VyY2UucHJvcGVydGllcy53b3Jrc3BhY2VVcmx9XCIgdGFyZ2V0PVwiX2JsYW5rXCI+JHtyZXNvdXJjZS5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbiBmcm9tIERhdGFicmlja3MuLi5gKVxyXG5cclxuICAgICAgICByZXNvdXJjZVJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvZGF0YWJyaWNrcy8ke2VuZ2luZS5pZH0vY2x1c3RlcmApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBkYXRhYnJpY2tzIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzb3VyY2UgPSBhd2FpdCByZXNvdXJjZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdChyZXNvdXJjZSk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRG9uZS5gKVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBlZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIG1vZGFsUGFuZWxEYXRhRmFjdG9yeSB7XHJcblxyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbERhdGFGYWN0b3J5KG1vZGFsX2RhdGFfdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RhbF9kYXRhX3RhcmdldCBtb2RhbCBhdHRyaWJ1dGUgZGF0YS10YXJnZXRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbF9kYXRhX3RhcmdldCA9IG1vZGFsX2RhdGFfdGFyZ2V0O1xyXG4gICAgICAgIC8vIEdldCB0aGUgc21hbGwgbW9kYWxcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLmxnKCkuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLm9uVW5Mb2FkKGUgPT4gdGhpcy51bmxvYWRQYW5lbChlKSk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbEVuZ2luZTtcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIHVuZWNlc3NhcnkgYnV0dG9uc1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFbmdpbmUuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdj4mbmJzcDs8L2Rpdj5cIik7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuYXBwZW5kKFwiPGRpdiBjbGFzcz0nY29uc29sZSc+PC9kaXY+XCIpO1xyXG5cclxuICAgICAgICAvKiogQHR5cGUgSlF1ZXJ5PEhUTUxEaXZFbGVtZW50PiAqL1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICB0aGlzLmNvbnNvbGVFbGVtZW50ID0gdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkuZmluZCgnLmNvbnNvbGUnKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUgPSBuZXcgY29uc29sZTIodGhpcy5jb25zb2xlRWxlbWVudCwgdGhpcy5tb2RhbEVuZ2luZS5ib2R5KCkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgYXN5bmMgc2hvd25QYW5lbChldmVudCkge1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGBHZXR0aW5nIGluZm9ybWF0aW9uLi4uYClcclxuXHJcbiAgICAgICAgLy8gR2V0IHRoZSBlbmdpbmUgcmVxdWVzdCBpZCwgYW5kIHNldCBpdCBnbG9iYWx5XHJcbiAgICAgICAgdGhpcy5lbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG5cclxuICAgICAgICBsZXQgZW5naW5lUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9lbmdpbmVzLyR7dGhpcy5lbmdpbmVJZH1gKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKGVuZ2luZVJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IGVuZ2luZSBkZXRhaWxzXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBlbmdpbmUgPSBhd2FpdCBlbmdpbmVSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIC8vIHRpbWVvdXQgb2YgdGhlIHBhZ2UgZm9yIHNvbWUgcmVhc29uID9cclxuICAgICAgICBpZiAoIWVuZ2luZSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kRXJyb3IoXCJDYW4ndCBnZXQgZW5naW5lIGRldGFpbHNcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYFJlc291cmNlIGdyb3VwIDxzdHJvbmc+JHtlbmdpbmUucmVzb3VyY2VHcm91cE5hbWV9PC9zdHJvbmc+IC4uLmApXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYERhdGEgZmFjdG9yeSBWMjogPHN0cm9uZz4ke2VuZ2luZS5mYWN0b3J5TmFtZX08L3N0cm9uZz4uYClcclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgR2V0dGluZyBpbmZvcm1hdGlvbiBmcm9tIEF6dXJlLi4uYClcclxuXHJcbiAgICAgICAgbGV0IHJlc291cmNlUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lLmlkfWApO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAvLyBpZiBhbnkgZXJyb3IgdG8gcmV0cmlldmUgZGF0YSwgZ28gYmFjayBob21lIHBhZ2VcclxuICAgICAgICBpZiAocmVzb3VyY2VSZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihcIkNhbid0IGdldCBkYXRhIGZhY3RvcnkgZGV0YWlsc1wiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmVzb3VyY2UgPSBhd2FpdCByZXNvdXJjZVJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZE9iamVjdChyZXNvdXJjZSk7XHJcblxyXG4gICAgICAgIGxldCByZXNvdXJjZUxpbmtSZXNwb25zZSA9IGF3YWl0IGZldGNoKGAvYXBpL3Jlc291cmNlZ3JvdXBzLyR7ZW5naW5lLnJlc291cmNlR3JvdXBOYW1lfS9saW5rYCwge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBpZDogcmVzb3VyY2UuaWQgfSksXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW50ZXJydXB0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgLy8gaWYgYW55IGVycm9yIHRvIHJldHJpZXZlIGRhdGEsIGdvIGJhY2sgaG9tZSBwYWdlXHJcbiAgICAgICAgaWYgKHJlc291cmNlTGlua1Jlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZEVycm9yKFwiQ2FuJ3QgZ2V0IHJlc291cmNlIGdyb3VwIGxpbmsuXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHJlc291cmNlTGluayA9IGF3YWl0IHJlc291cmNlTGlua1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoYEF6dXJlIHJlc291cmNlIGdyb3VwIGxpbmsgOiA8YSBocmVmPSR7cmVzb3VyY2VMaW5rLnVyaX0gdGFyZ2V0PVwiX2JsYW5rXCI+JHtyZXNvdXJjZS5uYW1lfTwvYT5gKVxyXG5cclxuICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kTGluZShgRG9uZS5gKVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBhcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95LCB2YWx1ZSkge1xyXG5cclxuICAgICAgICBpZiAoIWRlcGxveSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKGRlcGxveS5zdGF0ZSkge1xyXG4gICAgICAgICAgICBjYXNlIFwiRXJyb3JcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRFcnJvcihkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRyb3BpbmdcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRHJvcHBlZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlLmFwcGVuZExpbmUoZGVwbG95Lm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUuYXBwZW5kV2FybmluZyhkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZS5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICB0aGlzLm1vZGFsRW5naW5lLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbFByZXZpZXcge1xyXG5cclxuXHJcbiAgICBzdGF0aWMgaW5pdGlhbGl6ZShtb2RhbF9kYXRhX3RhcmdldCkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbW9kYWxQYW5lbFByZXZpZXcobW9kYWxfZGF0YV90YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGFsX2RhdGFfdGFyZ2V0IG1vZGFsIGF0dHJpYnV0ZSBkYXRhLXRhcmdldFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihtb2RhbF9kYXRhX3RhcmdldCkge1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsX2RhdGFfdGFyZ2V0ID0gbW9kYWxfZGF0YV90YXJnZXQ7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcgPSBuZXcgbW9kYWxQYW5lbChtb2RhbF9kYXRhX3RhcmdldCkueGwoKS5jZW50ZXIoKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3Lm9uU2hvdyhlID0+IHRoaXMuc2hvd1BhbmVsKGUpKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEByZXR1cm5zIG1vZGFsUGFuZWwgKi9cclxuICAgIG1vZGFsKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm1vZGFsUHJldmlldztcclxuICAgIH1cclxuXHJcbiAgICBzdG9wKCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93UGFuZWwoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLl9pc0ludGVycnVwdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFByZXZpZXcuYm9keSgpLnRleHQoJ0xvYWRpbmcgLi4uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICAvLyBFeHRyYWN0IGluZm8gZnJvbSBkYXRhLSogYXR0cmlidXRlc1xyXG4gICAgICAgIHZhciBlbmdpbmVJZCA9IGJ1dHRvbi5kYXRhKCdlbmdpbmUtaWQnKVxyXG4gICAgICAgIHZhciBkYXRhU291cmNlTmFtZSA9IGJ1dHRvbi5kYXRhKCdkYXRhLXNvdXJjZS1uYW1lJylcclxuICAgICAgICB2YXIgc2NoZW1hTmFtZSA9IGJ1dHRvbi5kYXRhKCdzY2hlbWEtbmFtZScpXHJcbiAgICAgICAgdmFyIHRhYmxlTmFtZSA9IGJ1dHRvbi5kYXRhKCd0YWJsZS1uYW1lJylcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIGxldCBwcmV2aWV3Um93c1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvQXp1cmVTcWxEYXRhYmFzZS8ke2VuZ2luZUlkfS8ke2RhdGFTb3VyY2VOYW1lfS90YWJsZXMvJHtzY2hlbWFOYW1lfS8ke3RhYmxlTmFtZX0vcHJldmlld2ApO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByZXZpZXdSb3dzUmVzcG9uc2Uuc3RhdHVzICE9IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IHByZXZpZXdSb3dzID0gYXdhaXQgcHJldmlld1Jvd3NSZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZpZXdSb3dzLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkuZW1wdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1vZGFsUHJldmlldy5ib2R5KCkuYXBwZW5kKFwiPHRhYmxlIGlkPSd0YWJsZSc+PC90YWJsZT5cIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cxID0gcHJldmlld1Jvd3NbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb2x1bW5zID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbyBpbiByb3cxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZDogbyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCgnI3RhYmxlJykuYm9vdHN0cmFwVGFibGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBwcmV2aWV3Um93c1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS50ZXh0KCdObyByb3dzLi4uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIG5ldyBtb2RhbFBhbmVsRXJyb3IoXCJlcnJvclByZXZpZXdcIiwgZSkuc2hvdygpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICB1bmxvYWRQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxQcmV2aWV3LmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbFVzZXJzIHtcclxuXHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUobW9kYWxfZGF0YV90YXJnZXQpIHtcclxuICAgICAgICByZXR1cm4gbmV3IG1vZGFsUGFuZWxVc2Vycyhtb2RhbF9kYXRhX3RhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0KSB7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxfZGF0YV90YXJnZXQgPSBtb2RhbF9kYXRhX3RhcmdldDtcclxuICAgICAgICAvLyBHZXQgdGhlIHNtYWxsIG1vZGFsXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzID0gbmV3IG1vZGFsUGFuZWwobW9kYWxfZGF0YV90YXJnZXQpLnNtKCkuZ2VuZXJhdGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLm9uU2hvd24oZSA9PiB0aGlzLnNob3duUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5vblNob3coZSA9PiB0aGlzLnNob3dQYW5lbChlKSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcmV0dXJucyBtb2RhbFBhbmVsICovXHJcbiAgICBtb2RhbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tb2RhbFVzZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHNob3dQYW5lbChldmVudCkge1xyXG4gICAgICAgIHRoaXMuX2lzSW50ZXJydXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMuc3VibWl0QnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxVc2Vycy5kZWxldGVCdXR0b24oKS5oaWRlKCk7XHJcblxyXG4gICAgICAgIGxldCB0aXRsZVN0cmluZyA9IGJ1dHRvbi5kYXRhKCd0aXRsZScpO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS50ZXh0KCdMb2FkaW5nIC4uLicpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIHZhciBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuICAgICAgICB2YXIgdXNlcnNJZHNWYWwgPSBidXR0b24uZGF0YSgndXNlcnMtaWQnKSAvLyBFeHRyYWN0IGluZm8gZnJvbSBkYXRhLSogYXR0cmlidXRlc1xyXG5cclxuICAgICAgICBpZiAoIXVzZXJzSWRzVmFsIHx8IHVzZXJzSWRzVmFsID09PSAnJykge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLnRleHQoJ05vdGhpbmcgdG8gc2hvdy4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IHVzZXJzSWRzID0gdXNlcnNJZHNWYWwuc3BsaXQoJywnKS5tYXAodiA9PiB2LnRyaW0oKSk7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdXNlcnNJZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGkgPT09IDApXHJcbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsVXNlcnMuYm9keSgpLmVtcHR5KCk7XHJcblxyXG4gICAgICAgICAgICBsZXQgdXNlcklkID0gdXNlcnNJZHNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAoIXVzZXJJZCB8fCB1c2VySWQgPT0gJycpXHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubW9kYWxVc2Vycy5ib2R5KCkuYXBwZW5kKFxyXG4gICAgICAgICAgICAgICAgXCI8ZGl2IGNsYXNzPSdtLTMnIHN0eWxlPSdvdmVyZmxvdzphdXRvOyc+PG1ndC1wZXJzb24gdXNlci1pZD0nXCIgKyB1c2Vyc0lkc1tpXSArIFwiJyBmZXRjaC1pbWFnZT0ndHJ1ZScgcGVyc29uLWNhcmQ9J2hvdmVyJyB2aWV3PSd0d29MaW5lcyc+PC9tZ3QtcGVyc29uPjwvZGl2PlwiXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNJbnRlcnJ1cHRlZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIEBwYXJhbSB7aW1wb3J0KFwiYm9vdHN0cmFwXCIpLk1vZGFsRXZlbnRIYW5kbGVyPEhUTUxFbGVtZW50Pn0gZXZlbnQgKi9cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbFVzZXJzLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgbW9kYWxQYW5lbCB9IGZyb20gXCIuL21vZGFsUGFuZWwuanNcIjtcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgbW9kYWxQYW5lbEVycm9yIHtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kYWxfZGF0YV90YXJnZXQgbW9kYWwgYXR0cmlidXRlIGRhdGEtdGFyZ2V0XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG1vZGFsX2RhdGFfdGFyZ2V0LCBlcnJvck1lc3NhZ2UpIHtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbF9kYXRhX3RhcmdldCA9IG1vZGFsX2RhdGFfdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuZXJyb3JNZXNzYWdlID0gZXJyb3JNZXNzYWdlO1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvciA9IG5ldyBtb2RhbFBhbmVsKG1vZGFsX2RhdGFfdGFyZ2V0KS54bCgpLmNlbnRlcigpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3Iub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3Iub25TaG93KGUgPT4gdGhpcy5zaG93UGFuZWwoZSkpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHJldHVybnMgbW9kYWxQYW5lbCAqL1xyXG4gICAgbW9kYWwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kYWxFcnJvcjtcclxuICAgIH1cclxuXHJcbiAgICBzaG93KCkge1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5wYW5lbCgpLm1vZGFsKCdzaG93Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd1BhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5faXNJbnRlcnJ1cHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBsZXQgYnV0dG9uID0gJChldmVudC5yZWxhdGVkVGFyZ2V0KSAvLyBCdXR0b24gdGhhdCB0cmlnZ2VyZWQgdGhlIG1vZGFsXHJcblxyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLmRlbGV0ZUJ1dHRvbigpLmhpZGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgICAgIHRoaXMubW9kYWxFcnJvci50aXRsZSgpLnRleHQoXCJFcnJvclwiKTtcclxuICAgICAgICB0aGlzLm1vZGFsRXJyb3IuYm9keSgpLnRleHQodGhpcy5lcnJvck1lc3NhZ2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHNob3duUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG4gICAgfVxyXG5cclxuICAgIHVubG9hZFBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5tb2RhbEVycm9yLmJvZHkoKS5lbXB0eSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHtcclxuICAgIG1vZGFsUGFuZWxVc2VycyxcclxuICAgIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUsXHJcbiAgICBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cCxcclxuICAgIG1vZGFsUGFuZWxEYXRhYnJpY2tzLFxyXG4gICAgbW9kYWxQYW5lbERhdGFGYWN0b3J5XHJcbn0gZnJvbSBcIi4uL21vZGFsL2luZGV4LmpzXCI7XHJcblxyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uLmpzXCJcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGVuZ2luZURldGFpbHNQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsRGVwbG95bWVudE1lbWJlcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbFJlcXVlc3RNZW1iZXJzXCIpO1xyXG5cclxuICAgICAgICBtb2RhbFBhbmVsRGVsZXRlRW5naW5lLmluaXRpYWxpemUoXCJwYW5lbERlbGV0ZUVuZ2luZVwiKTtcclxuICAgICAgICBtb2RhbFBhbmVsUmVzb3VyY2VHcm91cC5pbml0aWFsaXplKFwicGFuZWxSZXNvdXJjZUdyb3VwXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxEYXRhYnJpY2tzLmluaXRpYWxpemUoXCJwYW5lbERhdGFicmlja3NcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbERhdGFGYWN0b3J5LmluaXRpYWxpemUoXCJwYW5lbERhdGFGYWN0b3J5XCIpO1xyXG5cclxuICAgICAgICB0aGlzLmlkID0gJChcIiNJZFwiKTtcclxuXHJcbiAgICAgICAgaWYgKCQoXCIjY29uc29sZVwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMiA9IG5ldyBjb25zb2xlMigkKFwiI2NvbnNvbGVcIiksICQoJ2Rpdi5kb2NraW5nLWZvcm0nKSk7XHJcblxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25TdGFydGVkLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5pZC52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24oXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95ZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vZmYoXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG59XHJcbiIsIu+7v2V4cG9ydCBjbGFzcyBkb3RtaW10YWJsZSB7XHJcblxyXG4gICAgc3RhdGljIGluaXRpYWxpemUoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHVybCwgdXJsQ291bnQsIHBhZ2VTaXplKSB7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy51cmwgPSB1cmw7XHJcbiAgICAgICAgdGhpcy51cmxDb3VudCA9IHVybENvdW50ID8/IHRoaXMudXJsICsgXCIvY291bnRcIjtcclxuXHJcbiAgICAgICAgdGhpcy5zcGlubmVyID0gJCgnI3NwaW5uZXItJyArIG5hbWUpO1xyXG4gICAgICAgIHRoaXMuYm9keSA9ICQoJyN0Ym9keS0nICsgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91cyA9ICQoJyNwcmV2aW91cy0nICsgbmFtZSk7XHJcbiAgICAgICAgdGhpcy5uZXh0ID0gJCgnI25leHQtJyArIG5hbWUpO1xyXG4gICAgICAgIHRoaXMucmVmcmVzaCA9ICQoJyNyZWZyZXNoLScgKyBuYW1lKTtcclxuXHJcbiAgICAgICAgLy8gZGlzYWJsZSBidXR0b25zXHJcbiAgICAgICAgdGhpcy5wcmV2aW91cy5wYXJlbnQoKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcclxuICAgICAgICB0aGlzLm5leHQucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcblxyXG4gICAgICAgIC8vIGdldCBhIHBhZ2VcclxuICAgICAgICB0aGlzLnBhZ2VJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5pdGVtc0NvdW50ID0gMDtcclxuICAgICAgICB0aGlzLnBhZ2VTaXplID0gcGFnZVNpemUgPz8gMjtcclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoLmNsaWNrKChldnQpID0+IHtcclxuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMucnVuKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJldmlvdXMuY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleCAtIDE7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLm5leHQuY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlSW5kZXggPSB0aGlzLnBhZ2VJbmRleCArIDE7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGxvYWQoKSB7XHJcbiAgICAgICAgbGV0IHVybCA9IHRoaXMudXJsICsgJz9wYWdlSW5kZXg9JyArIHRoaXMucGFnZUluZGV4ICsgJyZjb3VudD0nICsgdGhpcy5wYWdlU2l6ZTtcclxuXHJcbiAgICAgICAgdGhpcy5zcGlubmVyLnNob3coKTtcclxuICAgICAgICAvL2xldCBkID0gYXdhaXQgJC5nZXRKU09OKHVybCk7XHJcblxyXG4gICAgICAgIHRoaXMuYm9keS5sb2FkKHVybCwgKGQsIHN0YXR1cywgeGhyKSA9PiB7XHJcblxyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZXJyb3JcIikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFkIHx8IGQudHJpbSgpID09ICcnKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclJvd3MoJ05vIGRhdGEnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3Bpbm5lci5oaWRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlRGlzYWJsZUJ1dHRvbnMoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgcnVuKCkge1xyXG4gICAgICAgIHRoaXMuc3Bpbm5lci5zaG93KCk7XHJcbiAgICAgICAgdGhpcy5jbGVhclJvd3MoKTtcclxuXHJcbiAgICAgICAgJC5nZXRKU09OKHRoaXMudXJsQ291bnQsIGRhdGEgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zQ291bnQgPSBkYXRhLmNvdW50O1xyXG4gICAgICAgICAgICB0aGlzLmxvYWQoKTtcclxuICAgICAgICB9KS5mYWlsKChlcnJvcikgPT4ge1xyXG5cclxuICAgICAgICAgICAgbGV0IGVycm9yU3RyaW5nID0gZXJyb3IucmVzcG9uc2VKU09OID8gKGVycm9yLnJlc3BvbnNlSlNPTi5lcnJvciA/PyBlcnJvci5yZXNwb25zZUpTT04pIDogZXJyb3IucmVzcG9uc2VUZXh0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZGRGaXJzdFJvd1dhcm5pbmcoZXJyb3JTdHJpbmcpO1xyXG4gICAgICAgICAgICB0aGlzLnNwaW5uZXIuaGlkZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVuYWJsZURpc2FibGVCdXR0b25zKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRmlyc3RSb3dXYXJuaW5nKHRleHQpIHtcclxuICAgICAgICB0aGlzLmJvZHkuY2hpbGRyZW4oJ3RyJykuYWRkQ2xhc3MoJ2JnLWRhbmdlcicpO1xyXG4gICAgICAgIHRoaXMuYm9keS5jaGlsZHJlbigndHInKS5jaGlsZHJlbigndGQnKS5hZGRDbGFzcygndGV4dC1saWdodCcpLmFwcGVuZCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclJvd3ModGV4dCkge1xyXG4gICAgICAgIGxldCBjb2x1bW5zQ291bnQgPSB0aGlzLmJvZHkucGFyZW50KCkuZmluZCgndGgnKS5sZW5ndGg7XHJcbiAgICAgICAgaWYgKCFjb2x1bW5zQ291bnQpXHJcbiAgICAgICAgICAgIGNvbHVtbnNDb3VudCA9IHRoaXMuYm9keS5wYXJlbnQoKS5maW5kKCd0cicpLmxlbmd0aDtcclxuICAgICAgICBpZiAoIWNvbHVtbnNDb3VudClcclxuICAgICAgICAgICAgY29sdW1uc0NvdW50ID0gMTtcclxuXHJcbiAgICAgICAgdGV4dCA9IHRleHQgPz8gJyZuYnNwOyc7XHJcblxyXG4gICAgICAgIHRoaXMuYm9keS5odG1sKCc8dHI+PHRkIGNvbHNwYW49JyArIGNvbHVtbnNDb3VudCArICc+JyArIHRleHQgKyAnPC90ZD48L3RyPicpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBlbmFibGVEaXNhYmxlQnV0dG9ucygpIHtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucGFnZUluZGV4IDw9IDApXHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXMucGFyZW50KCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cclxuICAgICAgICBpZiAoKHRoaXMucGFnZUluZGV4ICsgMSkgKiB0aGlzLnBhZ2VTaXplID49IHRoaXMuaXRlbXNDb3VudClcclxuICAgICAgICAgICAgdGhpcy5uZXh0LnBhcmVudCgpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgdGhpcy5uZXh0LnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG5cclxuICAgIH1cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgcm91dGVyIGZyb20gXCIuLi9yb3V0ZXIuanNcIjtcclxuaW1wb3J0IHsgZG90bWltdGFibGUgfSBmcm9tIFwiLi4vZG90bWltdGFibGUuanNcIlxyXG5cclxuZXhwb3J0IGNsYXNzIGFkbWluUGFnZSB7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBkZWxheSB9IGZyb20gXCIuLi9oZWxwZXJzLmpzXCJcclxuaW1wb3J0IHsgY29uc29sZTIgfSBmcm9tIFwiLi4vY29uc29sZTIuanNcIjtcclxuaW1wb3J0IHsgbm90aWZpY2F0aW9uIH0gZnJvbSBcIi4uL25vdGlmaWNhdGlvbi5qc1wiXHJcbmltcG9ydCB7IG1vZGFsUGFuZWxVc2VycyB9IGZyb20gXCIuLi9tb2RhbC9tb2RhbFBhbmVsVXNlcnMuanNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBhZG1pbkRlcGxveW1lbnRFbmdpbmVQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuXHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRPd25lcnNcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbFVzZXJzLmluaXRpYWxpemUoXCJwYW5lbERlcGxveW1lbnRNZW1iZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0T3duZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxSZXF1ZXN0TWVtYmVyc1wiKTtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9ICQoXCIjRW5naW5lVmlld19JZFwiKTtcclxuICAgICAgICB0aGlzLmNvbnNvbGUyID0gbmV3IGNvbnNvbGUyKCQoXCIjY29uc29sZVwiKSwgJCgnZGl2LmRvY2tpbmctZm9ybScpKTtcclxuICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbiA9ICQoJyNsYXVuY2gnKTtcclxuICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbi5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaWQgfHwgIXRoaXMuaWQudmFsKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKFwiQ2FuJ3QgbGF1bmNoIGRlcGxveW1lbnQuIE5vIGVuZ2luZSByZXF1ZXN0IC4uLlwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBzdWJzY3JpYmUgdG8gZXZlbnQgZnJvbSBzaWduYWxyIGFib3V0IGRlcGxveW1lbnRcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RhcnRlZCwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5jb25uZWN0aW9uLmludm9rZSgnU3Vic2NyaWJlRGVwbG95bWVudEFzeW5jJywgdGhpcy5pZC52YWwoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIHN0YXJ0ZWQuXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJSZWFkeSB0byBkZXBsb3kuXCIpXHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXHJcbiAgICAgICAgICAgIHRoaXMubGF1bmNoQnV0dG9uLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0aW5nLCBhc3luYyAoKSA9PiBhd2FpdCB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0aW5nLi4uXCIpKTtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihub3RpZmljYXRpb24uT25Db25uZWN0ZWQsIGFzeW5jICgpID0+IGF3YWl0IHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIkJhY2tlbmQgc2VydmVyIGNvbm5lY3RlZC4uLlwiKSk7XHJcbiAgICAgICAgbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RvcHBlZCwgYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiQmFja2VuZCBzZXJ2ZXIgc3RvcHBlZC5cIikpO1xyXG5cclxuICAgICAgICAvLyBKdXN0IGluIGNhc2UgaXQncyBub3Qgc3RhcnRlZCAoYnV0IHNob3VsZCBiZSBkb25lIGFscmVhZHkgZnJvbSBob21lUGFnZS5qcylcclxuICAgICAgICBhd2FpdCBub3RpZmljYXRpb24uY3VycmVudC5zdGFydCgpO1xyXG5cclxuICAgICAgICB0aGlzLmxhdW5jaEJ1dHRvbi5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gTGF1bmNoIGEgdmFsaWRhdGlvbiBiZWZvcmVcclxuICAgICAgICAgICAgbGV0IGlzVmFsaWQgPSAkKFwiZm9ybVwiKS52YWxpZCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5sYXVuY2hKb2JBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIGFzeW5jIGxhdW5jaEpvYkFzeW5jKCkge1xyXG4gICAgICAgIHRoaXMuY29uc29sZTIuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKFwiRGVwbG95bWVudCBzdGFydGVkLlwiKVxyXG4gICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pZCB8fCAhdGhpcy5pZC52YWwoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZFdhcm5pbmcoXCJDYW4ndCBsYXVuY2ggZGVwbG95bWVudC4gTm8gZW5naW5lIHJlcXVlc3QgLi4uXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShcIlNhdmluZyBkZXBsb3ltZW50IHByb3BlcnRpZXMuLi5cIik7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIEZpcnN0LCBzYXZlIHRoZSBkZXBsb3ltZW50LlxyXG4gICAgICAgICAgICBhd2FpdCAkLnBvc3QoJycsICQoJ2Zvcm0nKS5zZXJpYWxpemUoKSk7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihgVW5hYmxlIHRvIHNhdmUgZW5naW5lIGRldGFpbHNgKTtcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QoZS5yZXNwb25zZUpTT04pO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZExpbmUoXCJXYWl0aW5nIGZvciBhbiBhZ2VudCB0byBlbnF1ZXVlIHRoZSBkZXBsb3ltZW50Li4uXCIpO1xyXG5cclxuICAgICAgICAgICAgLy8gdXJsIGZvciB0aGF0IHBhcnRpY3VsYXIgZGVwbG95bWVudFxyXG4gICAgICAgICAgICBsZXQgdXJsID0gYC9hcGkvZW5naW5lcy8ke3RoaXMuaWQudmFsKCl9L2RlcGxveWA7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHsgbWV0aG9kOiAnUE9TVCcgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRFcnJvcihgPGI+RGVwbG95bWVudDwvYj4gJHt0aGlzLmlkLnZhbCgpfSBjYW4gbm90IGJlIGRlcGxveWVkLi4uYCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3JKc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmNvbnNvbGUyLmFwcGVuZE9iamVjdChlcnJvckpzb24pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgZGVwbG95bWVudHN0YXJ0ID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUoZGVwbG95bWVudHN0YXJ0KVxyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kRXJyb3IoYFVuYWJsZSB0byBkZXBsb3kgZW5naW5lYCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kT2JqZWN0KGUucmVzcG9uc2VKU09OKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95ZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uVW5sb2FkKCkge1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9mZihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQge1xyXG4gICAgbW9kYWxQYW5lbFVzZXJzLFxyXG4gICAgbW9kYWxQYW5lbERlbGV0ZUVuZ2luZSxcclxuICAgIG1vZGFsUGFuZWxSZXNvdXJjZUdyb3VwLFxyXG4gICAgbW9kYWxQYW5lbERhdGFicmlja3MsXHJcbiAgICBtb2RhbFBhbmVsRGF0YUZhY3RvcnlcclxufSBmcm9tIFwiLi4vbW9kYWwvaW5kZXguanNcIjtcclxuXHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuLi9ub3RpZmljYXRpb24uanNcIlxyXG5pbXBvcnQgeyBjb25zb2xlMiB9IGZyb20gXCIuLi9jb25zb2xlMi5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgYWRtaW5FbmdpbmVSZXF1ZXN0RGV0YWlsc1BhZ2Uge1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxEZXBsb3ltZW50T3duZXJzXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxVc2Vycy5pbml0aWFsaXplKFwicGFuZWxEZXBsb3ltZW50TWVtYmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsUmVxdWVzdE93bmVyc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsVXNlcnMuaW5pdGlhbGl6ZShcInBhbmVsUmVxdWVzdE1lbWJlcnNcIik7XHJcblxyXG4gICAgICAgIG1vZGFsUGFuZWxEZWxldGVFbmdpbmUuaW5pdGlhbGl6ZShcInBhbmVsRGVsZXRlRW5naW5lXCIpO1xyXG4gICAgICAgIG1vZGFsUGFuZWxSZXNvdXJjZUdyb3VwLmluaXRpYWxpemUoXCJwYW5lbFJlc291cmNlR3JvdXBcIik7XHJcbiAgICAgICAgbW9kYWxQYW5lbERhdGFicmlja3MuaW5pdGlhbGl6ZShcInBhbmVsRGF0YWJyaWNrc1wiKTtcclxuICAgICAgICBtb2RhbFBhbmVsRGF0YUZhY3RvcnkuaW5pdGlhbGl6ZShcInBhbmVsRGF0YUZhY3RvcnlcIik7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSAkKFwiI0lkXCIpO1xyXG5cclxuICAgICAgICBpZiAoJChcIiNjb25zb2xlXCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnNvbGUyID0gbmV3IGNvbnNvbGUyKCQoXCIjY29uc29sZVwiKSwgJCgnZGl2LmRvY2tpbmctZm9ybScpKTtcclxuXHJcbiAgICAgICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGF3YWl0IG5vdGlmaWNhdGlvbi5jdXJyZW50LmNvbm5lY3Rpb24uaW52b2tlKCdTdWJzY3JpYmVEZXBsb3ltZW50QXN5bmMnLCB0aGlzLmlkLnZhbCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vbihcImRlcGxveVwiLCB0aGlzLmFwcGVuZERlcGxveVRvQ29uc29sZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgYXBwZW5kRGVwbG95VG9Db25zb2xlKGRlcGxveSwgdmFsdWUpIHtcclxuXHJcbiAgICAgICAgaWYgKCFkZXBsb3kpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgc3dpdGNoIChkZXBsb3kuc3RhdGUpIHtcclxuICAgICAgICAgICAgY2FzZSBcIkVycm9yXCI6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnNvbGUyLmFwcGVuZEVycm9yKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiRGVwbG95ZWRcIjpcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc29sZTIuYXBwZW5kTGluZShkZXBsb3kubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBcIkRlcGxveWluZ1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRMaW5lKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRXYXJuaW5nKGRlcGxveS5tZXNzYWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZSlcclxuICAgICAgICAgICAgdGhpcy5jb25zb2xlMi5hcHBlbmRPYmplY3QodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5vZmYoXCJkZXBsb3lcIiwgdGhpcy5hcHBlbmREZXBsb3lUb0NvbnNvbGUuYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG4iLCLvu79cblxuZXhwb3J0IGNsYXNzIG1ndGxvYWRlciB7XG5cclxuXG4gICAgc3RhdGljIHNldE1ndFByb3ZpZGVyKCkge1xuICAgICAgICBjb25zdCBwcm92aWRlciA9IG5ldyBtZ3QuUHJveHlQcm92aWRlcihcIi9hcGkvUHJveHlcIik7XG4gICAgICAgIHByb3ZpZGVyLmxvZ2luID0gKCkgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL0FjY291bnQvU2lnbkluP3JlZGlyZWN0VXJpPScgKyB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgcHJvdmlkZXIubG9nb3V0ID0gKCkgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL01pY3Jvc29mdElkZW50aXR5L0FjY291bnQvU2lnbk91dCc7XG5cbiAgICAgICAgbWd0LlByb3ZpZGVycy5nbG9iYWxQcm92aWRlciA9IHByb3ZpZGVyO1xuICAgIH1cblxuICAgIHN0YXRpYyBpbnRlcmNlcHRNZ3RMb2dpbigpIHtcbiAgICAgICAgdmFyIG1ndGxvZ2luID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21ndGxvZ2luJyk7XG5cbiAgICAgICAgLy8vLyBUaGVzZXMgZXZlbnRzIGFyZSByYWlzZWQgd2hlbiB1c2VyIGNsaWNrIG9uIGxvZ2luIG91ciBsb2dvdXQgYnV0dG9uXG4gICAgICAgIC8vLy8gVGhleXIgYXJlIG5vdCByYWlzZWQgYXQgdGhlIGdvb2QgdGltaW5nXG4gICAgICAgIC8vLy8gU2hvdWxkIGJlIHJlbmFtZWQgJ2xvZ2luQ2xpY2snIGFuZCAnbG9nb3V0Q2xpY2snXG4gICAgICAgIC8vbWd0bG9naW4uYWRkRXZlbnRMaXN0ZW5lcignbG9naW5Db21wbGV0ZWQnLCAoKSA9PiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInVzZXJkZXRhaWxzXCIpKTtcbiAgICAgICAgLy9tZ3Rsb2dpbi5hZGRFdmVudExpc3RlbmVyKCdsb2dvdXRDb21wbGV0ZWQnLCAoKSA9PiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInVzZXJkZXRhaWxzXCIpKTtcblxuICAgICAgICAvLy8vIGdldCBsb2NhbCBzdG9yYWdlIGl0ZW0gaWYgYW55XG4gICAgICAgIC8vdmFyIHVzZXJEZXRhaWxzRnJvbVN0b3JhZ2VTdHJpbmcgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcmRldGFpbHMnKTtcblxuICAgICAgICAvL2lmICh1c2VyRGV0YWlsc0Zyb21TdG9yYWdlU3RyaW5nICE9PSBudWxsICYmIG1ndGxvZ2luLnVzZXJEZXRhaWxzID09PSBudWxsKVxuICAgICAgICAvLyAgICBtZ3Rsb2dpbi51c2VyRGV0YWlscyA9IEpTT04ucGFyc2UodXNlckRldGFpbHNGcm9tU3RvcmFnZVN0cmluZyk7XG5cbiAgICAgICAgLy8vLyBMb2FkaW5nIGNvbXBsZXRlZCBpcyBjb3JyZWN0bHkgZmlyZWQgQUZURVIgY29tcG9uZW50IGlzIGxvYWRlZCBBTkQgdXNlciBsb2dnZWQgaW5cbiAgICAgICAgLy9tZ3Rsb2dpbi5hZGRFdmVudExpc3RlbmVyKCdsb2FkaW5nQ29tcGxldGVkJywgKCkgPT4ge1xuICAgICAgICAvLyAgICBpZiAobWd0bG9naW4udXNlckRldGFpbHMgIT09IG51bGwpXG4gICAgICAgIC8vICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndXNlcmRldGFpbHMnLCBKU09OLnN0cmluZ2lmeShtZ3Rsb2dpbi51c2VyRGV0YWlscykpO1xuICAgICAgICAvL30pO1xuXG4gICAgfVxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBoYW5kbGVycyB9IGZyb20gXCIuL2hhbmRsZXJzLmpzXCJcclxuXHJcbmV4cG9ydCBjbGFzcyBhdXRoIHtcclxuXHJcblxyXG5cdC8vIHNpbmdsZXRvblxyXG5cdHN0YXRpYyBfY3VycmVudDtcclxuXHJcblx0LyoqIEByZXR1cm5zIHthdXRofSAqL1xyXG5cdHN0YXRpYyBnZXQgY3VycmVudCgpIHtcclxuXHRcdGlmICghYXV0aC5fY3VycmVudClcclxuXHRcdFx0YXV0aC5fY3VycmVudCA9IG5ldyBhdXRoKCk7XHJcblxyXG5cdFx0cmV0dXJuIGF1dGguX2N1cnJlbnQ7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgT25BdXRoZW50aWNhdGVkID0gXCJPbkF1dGhlbnRpY2F0ZWRcIlxyXG5cclxuXHRjb25zdHJ1Y3RvcigpIHtcclxuXHRcdHRoaXMuaGFuZGxlcnMgPSBuZXcgaGFuZGxlcnMoKTtcclxuXHJcblx0XHQvKiogQHR5cGUgYm9vbGVhbiAqL1xyXG5cdFx0dGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBnbG9iYWxVc2VyQXV0aGVudGljYXRlZDtcclxuXHR9XHJcblxyXG5cdGluaXRpYWxpemUoKSB7XHJcblxyXG5cdFx0JCgoKSA9PiB7XHJcblx0XHRcdC8vIGludm9rZSBhbGwgaGFuZGxlcnMgdG8gT25BdXRoZW50aWNhdGVkIHdpdGggdGhlIGNvcnJlY3QgdmFsdWVcclxuXHRcdFx0dGhpcy5oYW5kbGVycy5pbnZva2UoYXV0aC5PbkF1dGhlbnRpY2F0ZWQsIHRoaXMuaXNBdXRoZW50aWNhdGVkLCAnY29vbCcpXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdG9uKG1ldGhvZE5hbWUsIG5ld01ldGhvZCkge1xyXG5cdFx0dGhpcy5oYW5kbGVycy5vbihtZXRob2ROYW1lLCBuZXdNZXRob2QpO1xyXG5cdH1cclxuXHJcblx0b2ZmKG1ldGhvZE5hbWUsIG1ldGhvZCkge1xyXG5cdFx0dGhpcy5oYW5kbGVycy5vZmYobWV0aG9kTmFtZSwgbWV0aG9kKTtcclxuXHR9XHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IG1vZGFsUGFuZWwgfSBmcm9tIFwiLi4vbW9kYWwvbW9kYWxQYW5lbC5qc1wiO1xyXG5pbXBvcnQgeyBub3RpZmljYXRpb24gfSBmcm9tIFwiLi4vbm90aWZpY2F0aW9uLmpzXCI7XHJcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi4vYXV0aC5qc1wiXHJcblxyXG5leHBvcnQgY2xhc3MgaG9tZVBhZ2Uge1xyXG5cclxuICAgIC8vIHNpbmdsZXRvblxyXG4gICAgc3RhdGljIF9jdXJyZW50O1xyXG5cclxuICAgIC8qKiBAcmV0dXJucyB7aG9tZVBhZ2V9ICovXHJcbiAgICBzdGF0aWMgZ2V0IGN1cnJlbnQoKSB7XHJcbiAgICAgICAgaWYgKCFob21lUGFnZS5fY3VycmVudClcclxuICAgICAgICAgICAgaG9tZVBhZ2UuX2N1cnJlbnQgPSBuZXcgaG9tZVBhZ2UoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGhvbWVQYWdlLl9jdXJyZW50O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG4gICAgICAgICQoYXN5bmMgKCkgPT4gYXdhaXQgdGhpcy5vbkxvYWQoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICAvLyBHZXQgdGhlIG5vdGlmaWNhdGlvbiBtb2RhbFxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbCA9IG5ldyBtb2RhbFBhbmVsKFwibm90aWZcIikuc20oKS5nZW5lcmF0ZSgpO1xyXG5cclxuICAgICAgICAvLyBhdXRvIGJpbmQgd2l0aCBhcnJvdyBmdW5jdGlvblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5vblNob3duKGUgPT4gdGhpcy5zaG93blBhbmVsKGUpKTtcclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwub25VbkxvYWQoZSA9PiB0aGlzLnVubG9hZFBhbmVsKGUpKTtcclxuICAgICAgICAvLyBtYW51YWwgYmluZGluZyBmb3IgZnVuXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLm9uU2hvdyh0aGlzLnNob3dQYW5lbC5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsID0gbmV3IG1vZGFsUGFuZWwoXCJzZXR0aW5nc1wiKS5sZygpLmdlbmVyYXRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC5vblNob3duKGUgPT4gdGhpcy5zaG93blNldHRpbmdzUGFuZWwoZSkpO1xyXG4gICAgICAgIHRoaXMuc2V0dGluZ3NNb2RhbC5vblVuTG9hZChlID0+IHRoaXMudW5sb2FkU2V0dGluZ3NQYW5lbChlKSk7XHJcblxyXG5cclxuICAgICAgICAvL25vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PblN0YXJ0ZWQsIGFzeW5jICgpID0+IGF3YWl0IGNvbnNvbGUubG9nKFwiQmFja2VuZCBzZXJ2ZXIgc3RhcnRlZC5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uQ29ubmVjdGluZywgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0aW5nLi4uXCIpKTtcclxuICAgICAgICAvL25vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKG5vdGlmaWNhdGlvbi5PbkNvbm5lY3RlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBjb25uZWN0ZWQuLi5cIikpO1xyXG4gICAgICAgIC8vbm90aWZpY2F0aW9uLmN1cnJlbnQub24obm90aWZpY2F0aW9uLk9uU3RvcHBlZCwgYXN5bmMgKCkgPT4gYXdhaXQgY29uc29sZS5sb2coXCJCYWNrZW5kIHNlcnZlciBzdG9wcGVkLlwiKSk7XHJcblxyXG4gICAgICAgIC8vIHdoZW4gcmVjZWl2aW5nIGFuIG9yZGVyIHRvIHJlZnJlc2ggbm90aWZpY2F0aW9uc1xyXG4gICAgICAgIG5vdGlmaWNhdGlvbi5jdXJyZW50Lm9uKCdyZWZyZXNoX25vdGlmaWNhdGlvbnMnLCBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY2FsbCB0byByZWZyZXNoX25vdGlmaWNhdGlvbnNcIik7XHJcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBub3RpZmljYXRpb24uY3VycmVudC5zdGFydCgpO1xyXG5cclxuXHJcbiAgICAgICAgaWYgKGF1dGguY3VycmVudC5pc0F1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwic2V0dGluZ3NcIj5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtdGgtbGFyZ2VcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFib3V0ICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlNvbWV0aGluZyBpbnRlcmVzdGluZyBsaWtlLi4uIEhleSwgdGhpcyBpcyBhIHBpZWNlIG9mIE9TUyBwcm9qZWN0LCBtYWRlIGJ5IFNlYmFzdGllbiBQZXJ0dXM8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXMgZmEtY29nc1wiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdCBFbmdpbmUgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPiAgXHJcbiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cIm10LTJcIiBkYXRhLXN0eWxlPVwiYnRuLW91dGxpbmUtZGFya1wiIGRhdGEtY29udGFpbmVyPVwiYm9keVwiIGRhdGEtbGl2ZS1zZWFyY2g9XCJ0cnVlXCIgdGl0bGU9XCJDaG9vc2UgZGVmYXVsdCBlbmdpbmVcIiBpZD1cImRlZmF1bHRFbmdpbmVTZWxlY3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj5NdXN0YXJkPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24+S2V0Y2h1cDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPlJlbGlzaDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgYCk7XHJcblxyXG4gICAgICAgICAgICAkKCcjZGVmYXVsdEVuZ2luZVNlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG5cclxuIFxyXG5cclxuICAgICAgICBhdXRoLmN1cnJlbnQub24oYXV0aC5PbkF1dGhlbnRpY2F0ZWQsIGFzeW5jIGlzQXV0aCA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc0F1dGgpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hOb3RpZmljYXRpb25zQXN5bmMoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZGlzbWlzc05vdGlmaWNhdGlvbnNBc3luYygpIHtcclxuXHJcbiAgICAgICAgLy8gbG9hZGluZyBub3RpZmljYXRpb25zXHJcbiAgICAgICAgbGV0IHVybCA9IFwiL2FwaS9ub3RpZmljYXRpb25zXCI7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7IG1ldGhvZDogXCJERUxFVEVcIiB9KTtcclxuXHJcbiAgICAgICAgdmFyIGRlbGV0ZWQgPSByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgIGlmICghZGVsZXRlZClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGF3YWl0IHRoaXMucmVmcmVzaE5vdGlmaWNhdGlvbnNBc3luYygpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIHJlZnJlc2hOb3RpZmljYXRpb25zQXN5bmMoKSB7XHJcblxyXG4gICAgICAgIC8vIGxvYWRpbmcgbm90aWZpY2F0aW9uc1xyXG4gICAgICAgIGxldCB1cmwgPSBcIi9hcGkvbm90aWZpY2F0aW9uc1wiO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCk7XHJcblxyXG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmJvZHkoKS5lbXB0eSgpO1xyXG5cclxuICAgICAgICBsZXQgYmVsbENvbnRlbnQgPSAkKCcjbm90aWYtYmVsbC1jb250ZW50Jyk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5ub3RpZmljYXRpb25zIHx8IHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGggPD0gMCkge1xyXG5cclxuICAgICAgICAgICAgYmVsbENvbnRlbnQuaGlkZSgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHRoaXMubm90aWZNb2RhbC5ib2R5KCkuYXBwZW5kKGBcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmLWVtcHR5LWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFyIGZhLWJlbGxcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+Tm8gbmV3IG5vdGlmaWNhdGlvbnMsIHlldC48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PmApO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgYmVsbENvbnRlbnQuc2hvdygpO1xyXG4gICAgICAgICAgICBiZWxsQ29udGVudC50ZXh0KHRoaXMubm90aWZpY2F0aW9ucy5sZW5ndGgudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBub3RpZiBvZiB0aGlzLm5vdGlmaWNhdGlvbnMpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgbm90aWZVcmwgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmIChub3RpZi51cmwpXHJcbiAgICAgICAgICAgICAgICAgICAgbm90aWZVcmwgPSBgPGEgaHJlZj1cIiR7bm90aWYudXJsfVwiIGNsYXNzPVwibWwtMiBoaWRlLXNtXCI+PGkgY2xhc3M9XCJmYXMgZmEtZXh0ZXJuYWwtbGluay1hbHRcIj48L2k+PC9hPmA7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmJvZHkoKS5hcHBlbmQoYFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJub3RpZlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFzIGZhLWNoZWNrLWNpcmNsZVwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7bm90aWYudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmLW1lc3NhZ2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPiR7bm90aWYubWVzc2FnZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAke25vdGlmVXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2RpdiA+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXYgPiBgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBhc3luYyBzaG93blBhbmVsKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG4gICAgICAgIHZhciB0eXBlID0gYnV0dG9uLmRhdGEoJ3R5cGUnKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKiBAcGFyYW0ge2ltcG9ydChcImJvb3RzdHJhcFwiKS5Nb2RhbEV2ZW50SGFuZGxlcjxIVE1MRWxlbWVudD59IGV2ZW50ICovXHJcbiAgICBzaG93blNldHRpbmdzUGFuZWwoZXZlbnQpIHtcclxuXHJcbiAgICAgICAgbGV0IGJ1dHRvbiA9ICQoZXZlbnQucmVsYXRlZFRhcmdldCkgLy8gQnV0dG9uIHRoYXQgdHJpZ2dlcmVkIHRoZSBtb2RhbFxyXG5cclxuICAgICAgICBsZXQgdGl0bGVTdHJpbmcgPSBidXR0b24uZGF0YSgndGl0bGUnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXR0aW5nc01vZGFsLnN1Ym1pdEJ1dHRvbigpLmhpZGUoKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwudGl0bGUoKS50ZXh0KHRpdGxlU3RyaW5nKTtcclxuICAgICAgICB0aGlzLnNldHRpbmdzTW9kYWwuZGVsZXRlQnV0dG9uKCkuaGlkZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkU2V0dGluZ3NQYW5lbChldmVudCkge1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgc2hvd1BhbmVsKGV2ZW50KSB7XHJcblxyXG4gICAgICAgIGxldCBidXR0b24gPSAkKGV2ZW50LnJlbGF0ZWRUYXJnZXQpIC8vIEJ1dHRvbiB0aGF0IHRyaWdnZXJlZCB0aGUgbW9kYWxcclxuXHJcbiAgICAgICAgbGV0IHRpdGxlU3RyaW5nID0gYnV0dG9uLmRhdGEoJ3RpdGxlJyk7XHJcblxyXG4gICAgICAgIHRoaXMubm90aWZNb2RhbC5zdWJtaXRCdXR0b24oKS5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLnRpdGxlKCkudGV4dCh0aXRsZVN0cmluZyk7XHJcbiAgICAgICAgdGhpcy5ub3RpZk1vZGFsLmRlbGV0ZUJ1dHRvblRleHQoXCJEaXNtaXNzIG5vdGlmaWNhdGlvbnNcIik7XHJcblxyXG4gICAgICAgIGlmICghYXV0aC5jdXJyZW50LmlzQXV0aGVudGljYXRlZCkge1xyXG4gICAgICAgICAgICB0aGlzLm5vdGlmTW9kYWwuYm9keSgpLmFwcGVuZChgXHJcbiAgICAgICAgICAgICAgICAgICAgPCBkaXYgY2xhc3M9IFwibm90aWYtZW1wdHlcIiA+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5vdGlmLWVtcHR5LWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJmYXIgZmEtYmVsbFwiPjwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibm90aWYtZW1wdHktbWVzc2FnZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5QbGVhc2UgbG9nIGluIHRvIHNlZSBub3RpZmljYXRpb25zIGhlcmUuPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2ID4gYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5vdGlmTW9kYWwuZGVsZXRlQnV0dG9uKCkuY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5kaXNtaXNzTm90aWZpY2F0aW9uc0FzeW5jKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKiogQHBhcmFtIHtpbXBvcnQoXCJib290c3RyYXBcIikuTW9kYWxFdmVudEhhbmRsZXI8SFRNTEVsZW1lbnQ+fSBldmVudCAqL1xyXG4gICAgdW5sb2FkUGFuZWwoZXZlbnQpIHtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5leHBvcnQgY2xhc3Mgc2V0dGluZ3NQYWdlIHtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgIH1cclxuXHJcblxyXG4gICAgb25VbmxvYWQoKSB7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn1cclxuIiwi77u/ZXhwb3J0IGZ1bmN0aW9uIHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlKCRlbmdpbmVzVGFibGUsIHVybCwgY2hlY2tlZCwgb25Qb3N0Qm9keSwgb25DaGVja1Jvdykge1xyXG5cclxuXHJcbiAgICBsZXQgb25DaGVjayA9IGNoZWNrZWQgPyBvbkNoZWNrUm93IDogKCkgPT4geyB9O1xyXG4gICAgbGV0IG9uQ2xpY2sgPSBjaGVja2VkID8gKCkgPT4geyB9OiBvbkNoZWNrUm93O1xyXG5cclxuICAgIGxldCBjb2x1bW5zID0gW107XHJcbiAgICBpZiAoY2hlY2tlZClcclxuICAgICAgICBjb2x1bW5zLnB1c2goe1xyXG4gICAgICAgICAgICBmaWVsZDogJ2VuZ2luZUlkJyxcclxuICAgICAgICAgICAgcmFkaW86IHRydWUsXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICBjb2x1bW5zLnB1c2goe1xyXG4gICAgICAgIGZpZWxkOiAnZW5naW5lVHlwZUpzb24nLFxyXG4gICAgICAgIHRpdGxlOiAnVHlwZScsXHJcbiAgICAgICAgd2lkdGg6ICc4MCcsXHJcbiAgICAgICAgYWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgIHNlYXJjaEZvcm1hdHRlcjogZmFsc2UsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIHJvdykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYDxkaXYgY2xhc3M9J3N2Zy0yMngyMi1pY29uJz48ZGl2IGNsYXNzPSdzdmctaWNvbiAke3ZhbHVlLmVuZ2luZVR5cGVJY29uU3RyaW5nfSc+PC9kaXY+PC9kaXY+YDtcclxuICAgICAgICB9XHJcbiAgICB9LCB7XHJcbiAgICAgICAgZmllbGQ6ICdzdGF0dXNKc29uJyxcclxuICAgICAgICB0aXRsZTogJ1N0YXR1cycsXHJcbiAgICAgICAgd2lkdGg6ICc4MCcsXHJcbiAgICAgICAgYWxpZ246ICdjZW50ZXInLFxyXG4gICAgICAgIHNlYXJjaEZvcm1hdHRlcjogZmFsc2UsXHJcbiAgICAgICAgc29ydGFibGU6IHRydWUsXHJcbiAgICAgICAgZm9ybWF0dGVyOiAodmFsdWUsIHJvdykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYDxpIGNsYXNzPVwiJHt2YWx1ZS5zdGF0dXNJY29ufVwiIHRpdGxlPScke3ZhbHVlLnN0YXR1c1N0cmluZ30nIHN0eWxlPVwiY29sb3I6JHt2YWx1ZS5zdGF0dXNDb2xvcn07d2lkdGg6MjBweDtcIj48L2k+YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSwge1xyXG4gICAgICAgIGZpZWxkOiAnZW5naW5lTmFtZScsXHJcbiAgICAgICAgdGl0bGU6ICdOYW1lJyxcclxuICAgICAgICBzb3J0YWJsZTogdHJ1ZSxcclxuICAgICAgICBmb3JtYXR0ZXI6ICh2YWx1ZSwgcm93KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBgPHN0cm9uZz4ke3ZhbHVlfTwvc3Ryb25nPmA7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgc2VhcmNoOiBmYWxzZSxcclxuICAgICAgICBzaG93UmVmcmVzaDogZmFsc2UsXHJcbiAgICAgICAgc2hvd1RvZ2dsZTogZmFsc2UsXHJcbiAgICAgICAgY2hlY2tib3hIZWFkZXI6IGZhbHNlLFxyXG4gICAgICAgIGNsaWNrVG9TZWxlY3Q6IHRydWUsXHJcbiAgICAgICAgcGFnaW5hdGlvbjogZmFsc2UsXHJcbiAgICAgICAgcmVzaXphYmxlOiB0cnVlLFxyXG4gICAgICAgIGxvYWRpbmdUZW1wbGF0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gJzxpIGNsYXNzPVwiZmEgZmEtc3Bpbm5lciBmYS1zcGluIGZhLWZ3IGZhLTJ4XCI+PC9pPic7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5zLFxyXG4gICAgICAgIG9uUG9zdEJvZHk6IG9uUG9zdEJvZHksXHJcbiAgICAgICAgb25DaGVjazogb25DaGVjayxcclxuICAgICAgICBvbkNsaWNrUm93OiBvbkNsaWNrLFxyXG4gICAgICAgIGZvcm1hdE5vTWF0Y2hlczogKCkgPT4geyByZXR1cm4gXCJZb3UgZG9uJ3QgaGF2ZSBhbnkgcnVubmluZyBlbmdpbmUuIFBsZWFzZSA8YSBocmVmPScvRW5naW5lcy9JbmRleCc+Y2hlY2sgeW91ciBlbmdpbmVzIHN0YXR1cy48L2E+IFwiOyB9XHJcbiAgICB9KTtcclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZGF0YVNvdXJjZXNQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICAvLyBnZXQgdGFibGVcclxuICAgICAgICB0aGlzLmVuZ2luZXNUYWJsZSA9ICQoXCIjZW5naW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgZW5naW5lIHRhYmxlXHJcbiAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlID0gJChcIiNlbmdpbmVzVGFibGVcIik7XHJcblxyXG4gICAgICAgIHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlKHRoaXMuJGVuZ2luZXNUYWJsZSwgXCIvZGF0YVNvdXJjZXMvaW5kZXgvZW5naW5lc1wiLCB0cnVlLFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gdGhpcy5vblBvc3RCb2R5KGRhdGEpLFxyXG4gICAgICAgICAgICAocm93KSA9PiB0aGlzLm9uQ2xpY2tSb3cocm93KSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZSA9ICQoXCIjZGF0YVNvdXJjZXNUYWJsZVwiKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUuYm9vdHN0cmFwVGFibGUoe1xyXG4gICAgICAgICAgICBmb3JtYXROb01hdGNoZXM6ICgpID0+IHsgcmV0dXJuICdQbGVhc2Ugc2VsZWN0IGEgcnVubmluZyBlbmdpbmUgdG8gc2VlIGFsbCBkYXRhIHNvdXJjZXMgYXZhaWxhYmxlLic7IH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLm9uKCdjbGljay1yb3cuYnMudGFibGUnLCAocm93LCAkZWxlbWVudCwgZmllbGQpID0+IHtcclxuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgL0RhdGFTb3VyY2VzL0VkaXQvJHt0aGlzLmVuZ2luZS5pZH0vJHskZWxlbWVudC5uYW1lfWA7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Qb3N0Qm9keShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVuZ2luZSA9IGRhdGFbMF07XHJcbiAgICAgICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnY2hlY2snLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25DbGlja1Jvdyhyb3cpIHtcclxuXHJcbiAgICAgICAgdGhpcy5lbmdpbmUgPSByb3c7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5sb2FkRGF0YVNvdXJjZXNBc3luYyh0aGlzLmVuZ2luZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIGxvYWREYXRhU291cmNlc0FzeW5jKGVuZ2luZSkge1xyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3Nob3dMb2FkaW5nJyk7XHJcbiAgICAgICAgbGV0IGRhdGFfdXJsID0gYC9kYXRhU291cmNlcy9pbmRleC9kYXRhU291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZS5pZH1gO1xyXG4gICAgICAgIGxldCBkYXRhU291cmNlc1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goZGF0YV91cmwpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXMgPSBhd2FpdCBkYXRhU291cmNlc1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmRhdGFTb3VyY2VzKVxyXG4gICAgICAgICAgICB0aGlzLmRhdGFTb3VyY2VzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSgndXBkYXRlRm9ybWF0VGV4dCcsICdmb3JtYXROb01hdGNoZXMnLFxyXG4gICAgICAgICAgICBgTm8gZGF0YSBzb3VyY2VzIGZvciBlbmdpbmUgPHN0cm9uZz4ke2VuZ2luZS5lbmdpbmVOYW1lfTwvc3Ryb25nPi4gPGEgaHJlZj0nL2RhdGFTb3VyY2VzL25ldyc+Q3JlYXRlIGEgbmV3IGRhdGEgc291cmNlPC9hPiBmb3IgeW91ciBlbmdpbmVgKTtcclxuXHJcbiAgICAgICAgdGhpcy5kYXRhU291cmNlc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdsb2FkJywgdGhpcy5kYXRhU291cmNlcyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnaGlkZUxvYWRpbmcnKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25VbkxvYWQoKSB7XHJcblxyXG4gICAgfVxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCB7IHNldEVuZ2luZUJvb3RzdHJhcFRhYmxlIH0gZnJvbSBcIi4uL2Jvb3RzdHJhcFRhYmxlcy9pbmRleC5qc1wiO1xyXG5cclxuZXhwb3J0IGNsYXNzIHdpemFyZFBhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGh0bWxGaWVsZFByZWZpeCwgZW5naW5lVXJsKSB7XHJcblxyXG4gICAgICAgIC8vIEh0bWxGaWVsZFByZWZpeCBwcmVmaXggaXMgdGhlIHByZWRpeCBmb3IgcmVuZGVyaW5nIGFzcC5uZXQgY29yZSBpdGVtc1xyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gYCR7aHRtbEZpZWxkUHJlZml4fV9gO1xyXG5cclxuICAgICAgICAvLyB1cmwgZm9yIGxvYWRpbmcgZW5naW5lc1xyXG4gICAgICAgIHRoaXMuZW5naW5lVXJsID0gZW5naW5lVXJsO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICAvLyBnZXQgZm9ybVxyXG4gICAgICAgIHRoaXMuJGZvcm0gPSAkKFwiZm9ybVwiKTtcclxuXHJcbiAgICAgICAgLy8gZ2V0IGVuZ2luZSB0YWJsZVxyXG4gICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZSA9ICQoXCIjZW5naW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgc3Bpbm5lclxyXG4gICAgICAgIHRoaXMuJHNwaW5uZXIgPSAkKFwiI3NwaW5uZXJcIilcclxuXHJcbiAgICAgICAgLy8gZ2V0IGJ1dHRvbnNcclxuICAgICAgICB0aGlzLiRuZXh0QnV0dG9uID0gJChcIiNuZXh0QnV0dG9uXCIpO1xyXG4gICAgICAgIHRoaXMuJHByZXZpb3VzQnV0dG9uID0gJChcIiNwcmV2aW91c0J1dHRvblwiKTtcclxuICAgICAgICB0aGlzLiRzYXZlQnV0dG9uID0gJChcIiNzYXZlQnV0dG9uXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgd2l6YXJkXHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQgPSAkKFwiI3NtYXJ0V2l6YXJkXCIpO1xyXG5cclxuICAgICAgICAvLyBnZXQgcHJvcGVydGllcyBwYW5lbFxyXG4gICAgICAgIHRoaXMuJHByb3BlcnRpZXMgPSAkKFwiI3Byb3BlcnRpZXNcIik7XHJcblxyXG4gICAgICAgIC8vIGhpZGRlbiBmaWVsZHNcclxuICAgICAgICB0aGlzLiRlbmdpbmVJZEVsZW1lbnQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1FbmdpbmVJZGApO1xyXG4gICAgICAgIHRoaXMuJGlzTmV3ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9SXNOZXdgKTtcclxuXHJcbiAgICAgICAgLy8gTm8gcHJlZml4IGZvciBoaWRkZW50IFN0ZXAgZmllbGQsIHNpbmNlIGl0J3MgZGlyZWN0bHkgYmluZGVkIGludG8gdGhlIFBhZ2VNb2RlbFxyXG4gICAgICAgIHRoaXMuJHN0ZXAgPSAkKGAjU3RlcGApO1xyXG5cclxuICAgICAgICB0aGlzLnN0ZXAgPSB0aGlzLiRzdGVwICAmJiB0aGlzLiRzdGVwLnZhbCgpID8gcGFyc2VJbnQodGhpcy4kc3RlcC52YWwoKSkgOiAwO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kc3Bpbm5lcilcclxuICAgICAgICAgICAgdGhpcy4kc3Bpbm5lci5oaWRlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuYm9vc3RyYXBFbmdpbmVzVGFibGUoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib290c3RyYXBXaXphcmQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5ib290c3RyYXBCdXR0b25zKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGJvb3RzdHJhcFdpemFyZCgpIHtcclxuXHJcbiAgICAgICAgLy8gU3RlcCBzaG93IGV2ZW50XHJcbiAgICAgICAgdGhpcy4kc21hcnRXaXphcmQub24oXCJzaG93U3RlcFwiLCBhc3luYyAoZSwgYW5jaG9yT2JqZWN0LCBzdGVwTnVtYmVyLCBzdGVwRGlyZWN0aW9uLCBzdGVwUG9zaXRpb24pID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vIFVwZGF0ZSBzdGVwXHJcbiAgICAgICAgICAgIHRoaXMuJHN0ZXAudmFsKHN0ZXBOdW1iZXIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy4kcHJldmlvdXNCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJHNhdmVCdXR0b24uZGlzYWJsZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHN0ZXBQb3NpdGlvbiA9PT0gXCJmaXJzdFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSBcIm1pZGRsZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5lbmFibGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uZW5hYmxlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RlcFBvc2l0aW9uID09PSBcImxhc3RcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbmV4dEJ1dHRvbi5kaXNhYmxlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzYXZlQnV0dG9uLmVuYWJsZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gYm9vdHN0cmFwIHdpemFyZFxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKHtcclxuICAgICAgICAgICAgc2VsZWN0ZWQ6IHRoaXMuc3RlcCxcclxuICAgICAgICAgICAgdGhlbWU6ICdkb3RzJywgLy8gdGhlbWUgZm9yIHRoZSB3aXphcmQsIHJlbGF0ZWQgY3NzIG5lZWQgdG8gaW5jbHVkZSBmb3Igb3RoZXIgdGhhbiBkZWZhdWx0IHRoZW1lXHJcbiAgICAgICAgICAgIGF1dG9BZGp1c3RIZWlnaHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246ICdmYWRlJywgLy8gRWZmZWN0IG9uIG5hdmlnYXRpb24sIG5vbmUvZmFkZS9zbGlkZS1ob3Jpem9udGFsL3NsaWRlLXZlcnRpY2FsL3NsaWRlLXN3aW5nXHJcbiAgICAgICAgICAgICAgICBzcGVlZDogJzIwMCcsIC8vIFRyYW5zaW9uIGFuaW1hdGlvbiBzcGVlZFxyXG4gICAgICAgICAgICAgICAgZWFzaW5nOiAnJyAvLyBUcmFuc2l0aW9uIGFuaW1hdGlvbiBlYXNpbmcuIE5vdCBzdXBwb3J0ZWQgd2l0aG91dCBhIGpRdWVyeSBlYXNpbmcgcGx1Z2luXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVuYWJsZVVSTGhhc2g6IGZhbHNlLFxyXG4gICAgICAgICAgICB0b29sYmFyU2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIHRvb2xiYXJQb3NpdGlvbjogJ25vbmUnLCAvLyBub25lLCB0b3AsIGJvdHRvbSwgYm90aFxyXG4gICAgICAgICAgICAgICAgdG9vbGJhckJ1dHRvblBvc2l0aW9uOiAncmlnaHQnLCAvLyBsZWZ0LCByaWdodCwgY2VudGVyXHJcbiAgICAgICAgICAgICAgICBzaG93TmV4dEJ1dHRvbjogZmFsc2UsIC8vIHNob3cvaGlkZSBhIE5leHQgYnV0dG9uXHJcbiAgICAgICAgICAgICAgICBzaG93UHJldmlvdXNCdXR0b246IGZhbHNlLCAvLyBzaG93L2hpZGUgYSBQcmV2aW91cyBidXR0b25cclxuICAgICAgICAgICAgICAgIHRvb2xiYXJFeHRyYUJ1dHRvbnM6IFtdIC8vIEV4dHJhIGJ1dHRvbnMgdG8gc2hvdyBvbiB0b29sYmFyLCBhcnJheSBvZiBqUXVlcnkgaW5wdXQvYnV0dG9ucyBlbGVtZW50c1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBrZXlib2FyZFNldHRpbmdzOiB7XHJcbiAgICAgICAgICAgICAgICBrZXlOYXZpZ2F0aW9uOiBmYWxzZSwgLy8gRW5hYmxlL0Rpc2FibGUga2V5Ym9hcmQgbmF2aWdhdGlvbihsZWZ0IGFuZCByaWdodCBrZXlzIGFyZSB1c2VkIGlmIGVuYWJsZWQpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBlbmdpbmVUYWJsZU9uQ2hlY2tSb3cocm93LCAkZWxlbWVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLiRlbmdpbmVJZEVsZW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwocm93LmlkKTtcclxuXHJcbiAgICB9XHJcbiAgICBhc3luYyBlbmdpbmVUYWJsZU9uUG9zdEJvZHkoZGF0YSkge1xyXG5cclxuICAgICAgICBpZiAoIWRhdGE/Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLiRuZXh0QnV0dG9uLmRpc2FibGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGVuZ2luZUlkRWxlbWVudCAmJiB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkpIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBzZWxlY3RlZEluZGV4ID0gZGF0YS5maW5kSW5kZXgoZSA9PiBlLmlkID09PSB0aGlzLiRlbmdpbmVJZEVsZW1lbnQudmFsKCkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkSW5kZXggPj0gMClcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnY2hlY2snLCBzZWxlY3RlZEluZGV4KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGdldCB0aGUgcmFkaW8gaW5wdXRzIGJ1dHRvbnMgdG8gYWRkIGEgdmFsaWRhdGlvbiBydWxlIG9uIHRoZW1cclxuICAgICAgICBsZXQgJGJ0U2VsZWN0SXRlbSA9ICQoJ2lucHV0W25hbWU9XCJidFNlbGVjdEl0ZW1cIl0nKTtcclxuXHJcbiAgICAgICAgJGJ0U2VsZWN0SXRlbS5ydWxlcyhcImFkZFwiLCB7XHJcbiAgICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgICBtZXNzYWdlczoge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZWQ6IFwiWW91IHNob3VsZCBzZWxlY3QgYW4gZW5naW5lIGJlZm9yZSBnb2luZyBuZXh0IHN0ZXAuXCIsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYm9vc3RyYXBFbmdpbmVzVGFibGUoKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZW5naW5lc1RhYmxlIHx8ICF0aGlzLmVuZ2luZVVybClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSh0aGlzLiRlbmdpbmVzVGFibGUsIHRoaXMuZW5naW5lVXJsLCB0cnVlLFxyXG4gICAgICAgICAgICAoZGF0YSkgPT4gdGhpcy5lbmdpbmVUYWJsZU9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3csICRlbGVtZW50KSA9PiB0aGlzLmVuZ2luZVRhYmxlT25DaGVja1Jvdyhyb3csICRlbGVtZW50KSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGJvb3RzdHJhcEJ1dHRvbnMoKSB7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRwcmV2aW91c0J1dHRvbikge1xyXG4gICAgICAgICAgICB0aGlzLiRwcmV2aW91c0J1dHRvbi5jbGljaygoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwicHJldlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLiRuZXh0QnV0dG9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJG5leHRCdXR0b24uY2xpY2soKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnZhbGlkYXRlRm9ybSgpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcIm5leHRcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YWxpZGF0ZUZvcm0oKSB7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy4kZm9ybSlcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcblxyXG4gICAgICAgIGxldCBpc1ZhbGlkID0gdGhpcy4kZm9ybS52YWxpZCgpO1xyXG5cclxuICAgICAgICBpZiAoIWlzVmFsaWQpXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgbGV0IHZhbGlkYXRvciA9IHRoaXMuJGZvcm0udmFsaWRhdGUoKTtcclxuICAgICAgICB2YWxpZGF0b3IucmVzZXRGb3JtKCk7XHJcblxyXG4gICAgICAgIGxldCBzdW1tYXJ5ID0gdGhpcy4kZm9ybS5maW5kKFwiLnZhbGlkYXRpb24tc3VtbWFyeS1lcnJvcnNcIik7XHJcblxyXG4gICAgICAgIGlmIChzdW1tYXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gc3VtbWFyeS5maW5kKFwidWxcIik7XHJcbiAgICAgICAgICAgIGlmIChsaXN0KVxyXG4gICAgICAgICAgICAgICAgbGlzdC5lbXB0eSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG59Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlQXp1cmVTcWwge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZGF0YVNvdXJjZXMvbmV3L3Byb3BlcnRpZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZHZ0PUF6dXJlU3FsRGF0YWJhc2VgKTtcclxuICAgICAgICB9XHJcbiBcclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcblxyXG59Iiwi77u/ZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGFzeW5jIGxvYWRBc3luYyhlbmdpbmVJZCwgaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9kYXRhU291cmNlcy9uZXcvcHJvcGVydGllcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkdnQ9QXp1cmVCbG9iRlNgKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcblxyXG59Iiwi77u/ZXhwb3J0IGNsYXNzIGRhdGFTb3VyY2VBenVyZUNvc21vc0RiIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBhc3luYyBsb2FkQXN5bmMoZW5naW5lSWQsIGh0bWxGaWVsZFByZWZpeCwgZWxlbWVudCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZGF0YVNvdXJjZXMvbmV3L3Byb3BlcnRpZXM/ZW5naW5lSWQ9JHtlbmdpbmVJZH0mZHZ0PUNvc21vc0RiYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgd2l6YXJkUGFnZSB9IGZyb20gJy4uL3dpemFyZC9pbmRleC5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZVNxbCB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlU3FsLmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMiB9IGZyb20gJy4vZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMi5qcyc7XHJcbmltcG9ydCB7IGRhdGFTb3VyY2VBenVyZUNvc21vc0RiIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVDb3Ntb3NEYi5qcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgZGF0YVNvdXJjZU5ldyBleHRlbmRzIHdpemFyZFBhZ2Uge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCdEYXRhU291cmNlVmlldycsICcvZGF0YVNvdXJjZXMvbmV3L2VuZ2luZXMnKVxyXG5cclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VBenVyZVNxbCA9IG5ldyBkYXRhU291cmNlQXp1cmVTcWwoKTtcclxuICAgICAgICB0aGlzLmRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIgPSBuZXcgZGF0YVNvdXJjZUF6dXJlRGF0YUxha2VWMigpO1xyXG4gICAgICAgIHRoaXMuZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIgPSBuZXcgZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIoKTtcclxuICAgICAgICB0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPSAnJztcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG4gICAgICAgIC8vIGNhbGwgYmFzZSBvbkxvYWQgbWV0aG9kXHJcbiAgICAgICAgc3VwZXIub25Mb2FkKCk7XHJcblxyXG5cclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5vbihcInN0ZXBDb250ZW50XCIsIGFzeW5jIChlLCBhbmNob3JPYmplY3QsIHN0ZXBOdW1iZXIsIHN0ZXBEaXJlY3Rpb24pID0+IHtcclxuICAgICAgICAgICAgaWYgKHN0ZXBOdW1iZXIgPT0gMikge1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuJHNwaW5uZXI/LnNob3coKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy4kZW5naW5lSWRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9IHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwoKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbmdpbmVJZD8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGdldCBzZWxlY3Rpb24gZnJvbSBkYXRhIHNvdXJjZXMgdHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoYGlucHV0W25hbWU9XCJEYXRhU291cmNlVmlldy5EYXRhU291cmNlVHlwZVwiXTpjaGVja2VkYCkudmFsKClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJnb1RvU3RlcFwiLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdFR5cGVTZWxlY3RlZCA9PT0gdHlwZS50b1N0cmluZygpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0VHlwZVNlbGVjdGVkID0gdHlwZS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdhenVyZXNxbGRhdGFiYXNlJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YVNvdXJjZUF6dXJlU3FsLmxvYWRBc3luYyhlbmdpbmVJZCwgdGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdhenVyZXNxbGR3JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YVNvdXJjZUF6dXJlU3FsLmxvYWRBc3luYyhlbmdpbmVJZCwgdGhpcy5odG1sRmllbGRQcmVmaXgsIHRoaXMuJHByb3BlcnRpZXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpID09ICdhenVyZWJsb2JmcycpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmRhdGFTb3VyY2VBenVyZURhdGFMYWtlVjIubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgPT0gJ2Nvc21vc2RiJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIubG9hZEFzeW5jKGVuZ2luZUlkLCB0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLnNtYXJ0V2l6YXJkKFwiZ29Ub1N0ZXBcIiwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy4kc3Bpbm5lcj8uaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgLy8gR2V0dGluZyB0ZXN0IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uID0gJChcIiNkYXRhU291cmNlVGVzdEJ1dHRvblwiKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLmxlbmd0aCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24uY2xpY2soYXN5bmMgKGV2dCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfRW5naW5lSWRcIikudmFsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVuZ2luZUlkKVxyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuJGRhdGFTb3VyY2VUZXN0QnV0dG9uLnRlc3RBc3luYyhgL2FwaS9kYXRhZmFjdG9yaWVzLyR7ZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8vYXN5bmMgdGVzdENvbm5lY3Rpb25Bc3luYyhldnQpIHtcclxuXHJcbiAgICAvLyAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAvLyAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLnRleHQoXCJcIik7XHJcbiAgICAvLyAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLnJlbW92ZUNsYXNzKCk7XHJcblxyXG4gICAgLy8gICAgdGhpcy5idG5UZXN0Q29ubmVjdGlvbi5kaXNhYmxlKCk7XHJcblxyXG4gICAgLy8gICAgLy8gdXJsIGZvciB0aGF0IHBhcnRpY3VsYXIgZGVwbG95bWVudFxyXG4gICAgLy8gICAgbGV0IHVybCA9IGAvYXBpL2RhdGFTb3VyY2VzL3NxbGNvbm5lY3Rpb24vdGVzdGA7XHJcblxyXG4gICAgLy8gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICAvLyAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAvLyAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBjb25uZWN0aW9uOiB0aGlzLmNvbm5lY3Rpb25TdHJpbmcudmFsKCkgfSksXHJcbiAgICAvLyAgICAgICAgaGVhZGVyczoge1xyXG4gICAgLy8gICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxyXG4gICAgLy8gICAgICAgIH1cclxuICAgIC8vICAgIH0pO1xyXG5cclxuICAgIC8vICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAvLyAgICAgICAgdmFyIGVycm9ySnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgLy8gICAgICAgIGF3YWl0IHRoaXMubGJsVGVzdENvbm5lY3Rpb24udGV4dChlcnJvckpzb24uZXJyb3IpXHJcbiAgICAvLyAgICB9XHJcblxyXG4gICAgLy8gICAgdmFyIHJlc3VsdCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAvLyAgICBpZiAocmVzdWx0LnJlc3VsdCkge1xyXG4gICAgLy8gICAgICAgIHRoaXMubGJsVGVzdENvbm5lY3Rpb24uYWRkQ2xhc3MoXCJ0ZXh0LXN1Y2Nlc3MgbWwtMlwiKTtcclxuICAgIC8vICAgICAgICB0aGlzLmxibFRlc3RDb25uZWN0aW9uLmh0bWwoXCI8aSBjbGFzcz0nZmFzIGZhLWNoZWNrLWNpcmNsZSc+PC9pPiAgQ29ubmVjdGlvbiBzdWNjZXNzZnVsXCIpO1xyXG4gICAgLy8gICAgfVxyXG4gICAgLy8gICAgZWxzZSB7XHJcbiAgICAvLyAgICAgICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5hZGRDbGFzcyhcInRleHQtZGFuZ2VyIG1sLTJcIik7XHJcbiAgICAvLyAgICAgICAgdGhpcy5sYmxUZXN0Q29ubmVjdGlvbi5odG1sKFwiPGkgY2xhc3M9J2ZhcyBmYS1leGNsYW1hdGlvbi1jaXJjbGUnPjwvaT4gIENhbid0IGNvbm5lY3QgdG8gdGhlIHNvdXJjZSB1c2luZyB0aGlzIGNvbm5lY3Rpb24gc3RyaW5nXCIpO1xyXG4gICAgLy8gICAgfVxyXG5cclxuICAgIC8vICAgIHRoaXMuYnRuVGVzdENvbm5lY3Rpb24uZW5hYmxlKCk7XHJcbiAgICAvL31cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyB3aXphcmRQYWdlIH0gZnJvbSAnLi4vd2l6YXJkL2luZGV4LmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlU3FsIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVTcWwuanMnO1xyXG5pbXBvcnQgeyBkYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyIH0gZnJvbSAnLi9kYXRhU291cmNlQXp1cmVEYXRhTGFrZVYyLmpzJztcclxuaW1wb3J0IHsgZGF0YVNvdXJjZUF6dXJlQ29zbW9zRGIgfSBmcm9tICcuL2RhdGFTb3VyY2VBenVyZUNvc21vc0RiLmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBkYXRhU291cmNlRWRpdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Mb2FkKCkge1xyXG5cclxuICAgICAgICB0aGlzLmVuZ2luZUlkID0gJChcIiNEYXRhU291cmNlVmlld19FbmdpbmVJZFwiKS52YWwoKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24gPSAkKFwiI2RhdGFTb3VyY2VUZXN0QnV0dG9uXCIpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy4kZGF0YVNvdXJjZVRlc3RCdXR0b24ubGVuZ3RoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi5jbGljayhhc3luYyAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmdpbmVJZClcclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLiRkYXRhU291cmNlVGVzdEJ1dHRvbi50ZXN0QXN5bmMoYC9hcGkvZGF0YWZhY3Rvcmllcy8ke3RoaXMuZW5naW5lSWR9L3Rlc3RgKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRzb3VyY2VDb2RlID0gJChcIiNzb3VyY2VDb2RlXCIpO1xyXG5cclxuICAgICAgICBsZXQganNvbk9iamVjdFN0cmluZyA9ICQoXCIjRGF0YVNvdXJjZVZpZXdfSnNvblN0cmluZ1wiKS52YWwoKTtcclxuXHJcbiAgICAgICAgaWYgKGpzb25PYmplY3RTdHJpbmcgJiYganNvbk9iamVjdFN0cmluZy5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBvID0gSlNPTi5wYXJzZShqc29uT2JqZWN0U3RyaW5nKTtcclxuICAgICAgICAgICAgbGV0IGpzb25TdHJpbmcgPSBQcmlzbS5oaWdobGlnaHQoSlNPTi5zdHJpbmdpZnkobywgbnVsbCwgMiksIFByaXNtLmxhbmd1YWdlcy5qc29uLCAnanNvbicpO1xyXG5cclxuICAgICAgICAgICAgbGV0ICRzb3VyY2VDb2RlID0gJChcIiNzb3VyY2VDb2RlXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCRzb3VyY2VDb2RlKVxyXG4gICAgICAgICAgICAgICAgJHNvdXJjZUNvZGUuaHRtbChqc29uU3RyaW5nKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuaW1wb3J0IHsgc2V0RW5naW5lQm9vdHN0cmFwVGFibGUgfSBmcm9tIFwiLi4vYm9vdHN0cmFwVGFibGVzL2luZGV4LmpzXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgb25Qb3N0Qm9keShkYXRhKSB7XHJcbiAgICAgICAgaWYgKGRhdGEgJiYgZGF0YS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW5naW5lID0gZGF0YVswXTtcclxuICAgICAgICAgICAgdGhpcy4kZW5naW5lc1RhYmxlLmJvb3RzdHJhcFRhYmxlKCdjaGVjaycsIDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkNsaWNrUm93KHJvdykge1xyXG4gICAgICAgIHRoaXMuZW5naW5lID0gcm93O1xyXG4gICAgICAgIGF3YWl0IHRoaXMubG9hZEVudGl0aWVzQXN5bmModGhpcy5lbmdpbmUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcblxyXG4gICAgICAgIC8vIGdldCB0YWJsZVxyXG4gICAgICAgIHRoaXMuJGVuZ2luZXNUYWJsZSA9ICQoXCIjZW5naW5lc1RhYmxlXCIpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuJGVuZ2luZXNUYWJsZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBzZXRFbmdpbmVCb290c3RyYXBUYWJsZSh0aGlzLiRlbmdpbmVzVGFibGUsICcvZW50aXRpZXMvaW5kZXgvZW5naW5lcycsIHRydWUsXHJcbiAgICAgICAgICAgIChkYXRhKSA9PiB0aGlzLm9uUG9zdEJvZHkoZGF0YSksXHJcbiAgICAgICAgICAgIChyb3cpID0+IHRoaXMub25DbGlja1Jvdyhyb3cpKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZSA9ICQoXCIjZW50aXRpZXNUYWJsZVwiKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSh7XHJcbiAgICAgICAgICAgIGZvcm1hdE5vTWF0Y2hlczogKCkgPT4geyByZXR1cm4gJ1BsZWFzZSBzZWxlY3QgYSBydW5uaW5nIGVuZ2luZSB0byBzZWUgYWxsIHRoZSBlbnRpdGllcy4nOyB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUub24oJ2NsaWNrLXJvdy5icy50YWJsZScsIChyb3csICRlbGVtZW50LCBmaWVsZCkgPT4ge1xyXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IGAvRW50aXRpZXMvRWRpdC8ke3RoaXMuZW5naW5lLmlkfS8keyRlbGVtZW50Lm5hbWV9YDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiBcclxuXHJcblxyXG4gICAgYXN5bmMgbG9hZEVudGl0aWVzQXN5bmMoZW5naW5lKSB7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3Nob3dMb2FkaW5nJyk7XHJcbiAgICAgICAgbGV0IGRhdGFfdXJsID0gYC9lbnRpdGllcy9pbmRleC9lbnRpdGllcz9lbmdpbmVJZD0ke2VuZ2luZS5pZH1gO1xyXG4gICAgICAgIGxldCBlbnRpdGllc1Jlc3BvbnNlID0gYXdhaXQgZmV0Y2goZGF0YV91cmwpO1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXMgPSBhd2FpdCBlbnRpdGllc1Jlc3BvbnNlLmpzb24oKTtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmVudGl0aWVzKVxyXG4gICAgICAgICAgICB0aGlzLmVudGl0aWVzID0gW107XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ3VwZGF0ZUZvcm1hdFRleHQnLCAnZm9ybWF0Tm9NYXRjaGVzJyxcclxuICAgICAgICAgICAgYE5vIGVudGl0aWVzIGZvciBlbmdpbmUgPHN0cm9uZz4ke2VuZ2luZS5lbmdpbmVOYW1lfTwvc3Ryb25nPi4gPGEgaHJlZj0nL2VudGl0aWVzL25ldyc+Q3JlYXRlIGEgbmV3IGVudGl0eTwvYT4gZm9yIHlvdXIgZW5naW5lYCk7XHJcblxyXG4gICAgICAgIHRoaXMuJGVudGl0aWVzVGFibGUuYm9vdHN0cmFwVGFibGUoJ2xvYWQnLCB0aGlzLmVudGl0aWVzKTtcclxuXHJcbiAgICAgICAgdGhpcy4kZW50aXRpZXNUYWJsZS5ib290c3RyYXBUYWJsZSgnaGlkZUxvYWRpbmcnKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGFzeW5jIG9uVW5Mb2FkKCkge1xyXG5cclxuICAgIH1cclxufSIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsLCBtb2RhbFBhbmVsRXJyb3IgfSBmcm9tICcuLi9tb2RhbC9pbmRleCc7XHJcblxyXG5leHBvcnQgY2xhc3MgZW50aXRpZXNBenVyZVNxbCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge0pRdWVyeTxIVE1MRWxlbWVudD59IGVsZW1lbnRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBlbmdpbmVJZFxyXG4gICAgICovXHJcbiAgICBhc3luYyBsb2FkQXN5bmMoaHRtbEZpZWxkUHJlZml4LCBlbGVtZW50LCBlbmdpbmVJZCkge1xyXG5cclxuICAgICAgICB0aGlzLmh0bWxGaWVsZFByZWZpeCA9IGh0bWxGaWVsZFByZWZpeDtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmlzTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGVsZW1lbnQubG9hZEFzeW5jKGAvZW50aXRpZXMvbmV3L2VudGl0aWVzP2R2dD1BenVyZVNxbFRhYmxlJmVuZ2luZUlkPSR7ZW5naW5lSWR9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBnZXQgZXJyb3JzIGxhYmVsc1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcyA9ICQoXCIjbGFiZWxFcnJvckRhdGFTb3VyY2VzXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JUYWJsZXMgPSAkKFwiI2xhYmVsRXJyb3JUYWJsZXNcIik7XHJcblxyXG4gICAgICAgIC8vIG9uY2UgbG9hZGVkLCBnZXQgdGhlIHNlbGVjdG9yc1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0ID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWVgKTtcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZyA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VzSXRlbXNTdHJpbmdgKTtcclxuICAgICAgICAvLyBvbiBkYXRhIHNvdXJjZXMgY2hhbmdlcywgcmVmcmVzaCB0aGUgdGFibGVzXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuY2hhbmdlKGFzeW5jICgpID0+IHsgYXdhaXQgdGhpcy5yZWZyZXNoVGFibGVzQXN5bmMoZW5naW5lSWQpIH0pO1xyXG5cclxuICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1UYWJsZU5hbWVgKTtcclxuICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3RTdHJpbmcgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1UYWJsZXNJdGVtc1N0cmluZ2ApO1xyXG4gICAgICAgIC8vIG9uIHRhYmxlIGNoYW5nZSwgc2V0IHRoZSBjb3JyZWN0IGF0dHJpYnV0ZXMgZm9yIHRoZSBwcmV2aWV3IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5jaGFuZ2UoKCkgPT4geyB0aGlzLnNldFByZXZpZXdEYXRhQXR0cmlidXRlcyhlbmdpbmVJZCkgfSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpLCAxMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlzTG9hZGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyByZWZyZXNoRGF0YVNvdXJjZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJMb2FkaW5nIERhdGEgU291cmNlcyAuLi5cIik7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcy5lbXB0eSgpO1xyXG5cclxuICAgICAgICBsZXQgZGF0YVNvdXJjZXNVcmwgPSBgL2VudGl0aWVzL25ldy9kYXRhc291cmNlcz9lbmdpbmVJZD0ke2VuZ2luZUlkfSZkYXRhU291cmNlVHlwZT1BenVyZVNxbERhdGFiYXNlYDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgIGxldCByID0gYXdhaXQgZmV0Y2goZGF0YVNvdXJjZXNVcmwpO1xyXG4gICAgICAgICAgICBsZXQgZGF0YVNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50VHlwZSA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKFwianNvblwiKSAhPT0gLTEpID8gKGF3YWl0IHIuanNvbigpKS5lcnJvci5tZXNzYWdlIDogYXdhaXQgci50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgZGF0YVNvdXJjZXNKc29uID0gYXdhaXQgci5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICBkYXRhU291cmNlcyA9IGRhdGFTb3VyY2VzSnNvbi5tYXAoaXRlbSA9PiBpdGVtLm5hbWUpO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKGRhdGFTb3VyY2VzLCAoaSwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuYXBwZW5kKCQoJzxvcHRpb24+JywgeyB2YWx1ZTogaXRlbSwgdGV4dDogaXRlbSB9KSlcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWRhdGFTb3VyY2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZGF0YShcIm5vbmVTZWxlY3RlZFRleHRcIiwgXCJObyBEYXRhIFNvdXJjZXMuLi5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nLnZhbChkYXRhU291cmNlcy5qb2luKCkpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgZGF0YVNvdXJjZVNlbGVjdGVkID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZU5hbWUgb3B0aW9uOnNlbGVjdGVkYCkudmFsKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0YVNvdXJjZVNlbGVjdGVkKVxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5yZWZyZXNoVGFibGVzQXN5bmMoZW5naW5lSWQpO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy50ZXh0KFwiVW5leHBlY3RlZCBTZXJ2ZXIgZXJyb3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiQ2FuJ3QgbG9hZCBEYXRhIFNvdXJjZXMuLi5cIik7XHJcblxyXG4gICAgICAgICAgICBuZXcgbW9kYWxQYW5lbEVycm9yKFwiZXJyb3JEYXRhU291cmNlc1wiLCBlKS5zaG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5lbmFibGVQaWNrZXIoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgcmVmcmVzaFRhYmxlc0FzeW5jKGVuZ2luZUlkKSB7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcy5lbXB0eSgpO1xyXG5cclxuICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuZGlzYWJsZVBpY2tlcihcImxvYWRpbmcgdGFibGVzIC4uLlwiKTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGFTb3VyY2VTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG4gICAgICAgIGxldCB0YWJsZXMgPSBbXTtcclxuICAgICAgICBsZXQgdGFibGVzVXJsID0gYC9hcGkvQXp1cmVTcWxEYXRhYmFzZS8ke2VuZ2luZUlkfS8ke2RhdGFTb3VyY2VTZWxlY3RlZH0vdGFibGVzYDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuXHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKHRhYmxlc1VybCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcy50ZXh0KHRleHQuZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyAhPSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCB0YWJsZXNKc29uID0gYXdhaXQgci5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGFibGVzID0gdGFibGVzSnNvbi5tYXAoaXRlbSA9PiBgJHtpdGVtLnNjaGVtYU5hbWV9LiR7aXRlbS50YWJsZU5hbWV9YCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKHRhYmxlcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiR0YWJsZXNTZWxlY3QuYXBwZW5kKCQoJzxvcHRpb24+JywgeyB2YWx1ZTogaXRlbSwgdGV4dDogaXRlbSB9KSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRhYmxlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIk5vIFRhYmxlcy4uLlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdFN0cmluZy52YWwoJycpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kdGFibGVzU2VsZWN0U3RyaW5nLnZhbCh0YWJsZXMuam9pbigpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHRhYmxlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1UYWJsZU5hbWUgb3B0aW9uOnNlbGVjdGVkYCkudmFsKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGFibGVTZWxlY3RlZClcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0UHJldmlld0RhdGFBdHRyaWJ1dGVzKGVuZ2luZUlkKTtcclxuXHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvclRhYmxlcy50ZXh0KFwiVW5leHBlY3RlZCBTZXJ2ZXIgZXJyb3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIkNhbid0IGxvYWQgRGF0YSBTb3VyY2VzLi4uXCIpO1xyXG5cclxuICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yRGF0YVNvdXJjZXNcIiwgZSkuc2hvdygpO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJHRhYmxlc1NlbGVjdC5lbmFibGVQaWNrZXIoKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgc2V0UHJldmlld0RhdGFBdHRyaWJ1dGVzKGVuZ2luZUlkKSB7XHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2VTZWxlY3RlZCA9ICQoYCMke3RoaXMuaHRtbEZpZWxkUHJlZml4fURhdGFTb3VyY2VOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICBpZiAoIWRhdGFTb3VyY2VTZWxlY3RlZD8ubGVuZ3RoKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIHZhciB0YWJsZVNlbGVjdGVkID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9VGFibGVOYW1lIG9wdGlvbjpzZWxlY3RlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICBpZiAoIXRhYmxlU2VsZWN0ZWQ/Lmxlbmd0aClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB2YXIgdGFibGVUYWIgPSB0YWJsZVNlbGVjdGVkLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICB2YXIgc2NoZW1hTmFtZSA9IHRhYmxlVGFiWzBdO1xyXG4gICAgICAgIHZhciB0YWJsZU5hbWUgPSB0YWJsZVRhYlsxXTtcclxuXHJcbiAgICAgICAgLy8gYmVmb3JlIHJlZnJlc2hpbmcgY29sdW1ucywgYWRkIGRhdGEgdG8gcHJldmlldyBidXR0b25zXHJcbiAgICAgICAgbGV0ICRwcmV2aWV3RW50aXR5QnV0dG9uID0gJChcIiNwcmV2aWV3RW50aXR5QnV0dG9uXCIpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJlbmdpbmUtaWRcIiwgZW5naW5lSWQpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJkYXRhLXNvdXJjZS1uYW1lXCIsIGRhdGFTb3VyY2VTZWxlY3RlZCk7XHJcbiAgICAgICAgJHByZXZpZXdFbnRpdHlCdXR0b24uZGF0YShcInNjaGVtYS1uYW1lXCIsIHNjaGVtYU5hbWUpO1xyXG4gICAgICAgICRwcmV2aWV3RW50aXR5QnV0dG9uLmRhdGEoXCJ0YWJsZS1uYW1lXCIsIHRhYmxlTmFtZSk7XHJcbiAgICAgICAgJHByZXZpZXdFbnRpdHlCdXR0b24uZGF0YShcInRpdGxlXCIsIGBUYWJsZSBwcmV2aWV3IFske3NjaGVtYU5hbWV9XS5bJHt0YWJsZU5hbWV9XWApO1xyXG5cclxuICAgIH1cclxuXHJcbn1cclxuIiwi77u/Ly8gQHRzLWNoZWNrXHJcblxyXG5pbXBvcnQgeyBtb2RhbFBhbmVsRXJyb3IgfSBmcm9tIFwiLi4vbW9kYWwvaW5kZXhcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBlbnRpdGllc0RlbGltaXRlZFRleHQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7SlF1ZXJ5PEhUTUxFbGVtZW50Pn0gZWxlbWVudFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVuZ2luZUlkXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWRBc3luYyhodG1sRmllbGRQcmVmaXgsIGVsZW1lbnQsIGVuZ2luZUlkKSB7XHJcblxyXG4gICAgICAgIHRoaXMuaHRtbEZpZWxkUHJlZml4ID0gaHRtbEZpZWxkUHJlZml4O1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgICAgICAgYXdhaXQgZWxlbWVudC5sb2FkQXN5bmMoYC9lbnRpdGllcy9uZXcvZW50aXRpZXM/ZHZ0PURlbGltaXRlZFRleHQmZW5naW5lSWQ9JHtlbmdpbmVJZH1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHRyYW5zZm9ybSBhbGwgc2VsZWN0IHBpY2tlciBpbnRvIHNlbGVjdHBpY2tlclxyXG4gICAgICAgICQoJ3NlbGVjdCcpLnNlbGVjdHBpY2tlcigpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gb25jZSBsb2FkZWQsIGdldCB0aGUgc2VsZWN0b3JzXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZWApO1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nID0gJChgIyR7dGhpcy5odG1sRmllbGRQcmVmaXh9RGF0YVNvdXJjZXNJdGVtc1N0cmluZ2ApO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcyA9ICQoXCIjbGFiZWxFcnJvckRhdGFTb3VyY2VzXCIpO1xyXG4gICAgICAgIC8vIG9uIGRhdGEgc291cmNlcyBjaGFuZ2VzLCByZWZyZXNoIHRoZSB0YWJsZXNcclxuICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5jaGFuZ2UoYXN5bmMgKCkgPT4geyBhd2FpdCB0aGlzLnJlZnJlc2hTdG9yYWdlc1BhdGhzKGVuZ2luZUlkKSB9KTtcclxuXHJcblxyXG4gICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1GdWxsUGF0aGApO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoID0gJChcIiNsYWJlbEVycm9yRGlyZWN0b3J5UGF0aFwiKTtcclxuXHJcblxyXG4gICAgICAgIGlmICghdGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMucmVmcmVzaERhdGFTb3VyY2VzQXN5bmMoZW5naW5lSWQpLCAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyByZWZyZXNoRGF0YVNvdXJjZXNBc3luYyhlbmdpbmVJZCkge1xyXG4gICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRpc2FibGVQaWNrZXIoXCJMb2FkaW5nIERhdGEgU291cmNlcyAuLi5cIik7XHJcbiAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIGxldCBkYXRhU291cmNlcyA9IFtdO1xyXG4gICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGAvZW50aXRpZXMvbmV3L2RhdGFzb3VyY2VzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmRhdGFTb3VyY2VUeXBlPUF6dXJlQmxvYlN0b3JhZ2VgKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyLnN0YXR1cyA+PSA0MDApIHtcclxuICAgICAgICAgICAgICAgIGxldCBjb250ZW50VHlwZSA9IHIuaGVhZGVycy5nZXQoXCJjb250ZW50LXR5cGVcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKFwianNvblwiKSAhPT0gLTEpID8gKGF3YWl0IHIuanNvbigpKS5lcnJvci5tZXNzYWdlIDogYXdhaXQgci50ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRsYWJlbEVycm9yRGF0YVNvdXJjZXMudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBkYXRhU291cmNlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgZGF0YVNvdXJjZXMgPSBkYXRhU291cmNlc0pzb24ubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhU291cmNlcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0sIHRleHQ6IGl0ZW0gfSkpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgciA9IGF3YWl0IGZldGNoKGAvZW50aXRpZXMvbmV3L2RhdGFzb3VyY2VzP2VuZ2luZUlkPSR7ZW5naW5lSWR9JmRhdGFTb3VyY2VUeXBlPUF6dXJlQmxvYkZTYCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRhdGFTb3VyY2VzLnRleHQodGV4dC5lcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhU291cmNlc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgZGF0YVNvdXJjZXMgPSBkYXRhU291cmNlc0pzb24ubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkYXRhU291cmNlcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmFwcGVuZCgkKCc8b3B0aW9uPicsIHsgdmFsdWU6IGl0ZW0sIHRleHQ6IGl0ZW0gfSkpXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGlmICghZGF0YVNvdXJjZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRkYXRhU291cmNlc1NlbGVjdC5kYXRhKFwibm9uZVNlbGVjdGVkVGV4dFwiLCBcIk5vIERhdGEgU291cmNlcy4uLlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0U3RyaW5nLnZhbCgnJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3RTdHJpbmcudmFsKGRhdGFTb3VyY2VzLmpvaW4oKSk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRhU291cmNlU2VsZWN0ZWQpXHJcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJlZnJlc2hTdG9yYWdlc1BhdGhzKGVuZ2luZUlkLCBkYXRhU291cmNlU2VsZWN0ZWQpO1xyXG5cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEYXRhU291cmNlcy50ZXh0KFwiVW5leHBlY3RlZCBTZXJ2ZXIgZXJyb3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMuJGRhdGFTb3VyY2VzU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiQ2FuJ3QgbG9hZCBEYXRhIFNvdXJjZXMuLi5cIik7XHJcblxyXG4gICAgICAgICAgICBuZXcgbW9kYWxQYW5lbEVycm9yKFwiZXJyb3JcIiwgZSkuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy4kZGF0YVNvdXJjZXNTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBhc3luYyByZWZyZXNoU3RvcmFnZXNQYXRocyhlbmdpbmVJZCkge1xyXG5cclxuICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmVtcHR5KCk7XHJcbiAgICAgICAgdGhpcy4kZGlyZWN0b3J5UGF0aFNlbGVjdC5kaXNhYmxlUGlja2VyKFwiTG9hZGluZyBhbGwgcGF0aHMgLi4uXCIpO1xyXG4gICAgICAgIHRoaXMuJGxhYmVsRXJyb3JEaXJlY3RvcnlQYXRoLmVtcHR5KCk7XHJcblxyXG4gICAgICAgIHZhciBkYXRhU291cmNlU2VsZWN0ZWQgPSAkKGAjJHt0aGlzLmh0bWxGaWVsZFByZWZpeH1EYXRhU291cmNlTmFtZSBvcHRpb246c2VsZWN0ZWRgKS52YWwoKTtcclxuXHJcblxyXG4gICAgICAgIGxldCBkaXJlY3RvcmllcyA9IFtdO1xyXG4gICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICBsZXQgciA9IGF3YWl0IGZldGNoKGAvYXBpL3N0b3JhZ2VzLyR7ZW5naW5lSWR9L2NvbnRhaW5lcnMvJHtkYXRhU291cmNlU2VsZWN0ZWR9YCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoci5zdGF0dXMgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgY29udGVudFR5cGUgPSByLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRleHQgPSAoY29udGVudFR5cGUgJiYgY29udGVudFR5cGUuaW5kZXhPZihcImpzb25cIikgIT09IC0xKSA/IChhd2FpdCByLmpzb24oKSkuZXJyb3IubWVzc2FnZSA6IGF3YWl0IHIudGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRpcmVjdG9yeVBhdGgudGV4dCh0ZXh0LmVycm9yLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBkaXJlY3Rvcmllc0pzb24gPSBhd2FpdCByLmpzb24oKTtcclxuICAgICAgICAgICAgZGlyZWN0b3JpZXMgPSBkaXJlY3Rvcmllc0pzb24ubWFwKGl0ZW0gPT4gaXRlbS5uYW1lKTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChkaXJlY3RvcmllcywgKGksIGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QuYXBwZW5kKCQoJzxvcHRpb24+JywgeyB2YWx1ZTogaXRlbSwgdGV4dDogaXRlbSB9KSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kbGFiZWxFcnJvckRpcmVjdG9yeVBhdGgudGV4dChcIlVuZXhwZWN0ZWQgU2VydmVyIGVycm9yXCIpO1xyXG4gICAgICAgICAgICB0aGlzLiRkaXJlY3RvcnlQYXRoU2VsZWN0LmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIFwiQ2FuJ3QgbG9hZCBTdG9yYWdlIGZpbGVzLi4uXCIpO1xyXG5cclxuICAgICAgICAgICAgbmV3IG1vZGFsUGFuZWxFcnJvcihcImVycm9yXCIsIGUpLnNob3coKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuJGRpcmVjdG9yeVBhdGhTZWxlY3QuZW5hYmxlUGlja2VyKCk7XHJcblxyXG4gICAgfVxyXG59XHJcbiIsIu+7vy8vIEB0cy1jaGVja1xyXG5pbXBvcnQgeyBtb2RhbFBhbmVsRXJyb3IsIG1vZGFsUGFuZWxQcmV2aWV3IH0gZnJvbSBcIi4uL21vZGFsL2luZGV4LmpzXCI7XHJcbmltcG9ydCB7IGVudGl0aWVzQXp1cmVTcWwgfSBmcm9tIFwiLi9lbnRpdGllc0F6dXJlU3FsLmpzXCI7XHJcbmltcG9ydCB7IGVudGl0aWVzRGVsaW1pdGVkVGV4dCB9IGZyb20gXCIuL2VudGl0aWVzRGVsaW1pdGVkVGV4dC5qc1wiO1xyXG5pbXBvcnQgeyB3aXphcmRQYWdlIH0gZnJvbSAnLi4vd2l6YXJkL2luZGV4LmpzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBlbnRpdGllc05ld1BhZ2UgZXh0ZW5kcyB3aXphcmRQYWdlIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcignRW50aXR5VmlldycsICcvZW50aXRpZXMvbmV3L2VuZ2luZXMnKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbnRpdGllc0F6dXJlU3FsID0gbmV3IGVudGl0aWVzQXp1cmVTcWwoKTtcclxuICAgICAgICB0aGlzLmVudGl0aWVzRGVsaW1pdGVkVGV4dCA9IG5ldyBlbnRpdGllc0RlbGltaXRlZFRleHQoKTtcclxuICAgICAgICB0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPSAnJztcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICAgICAgLy8gY2FsbCBiYXNlIG9uTG9hZCBtZXRob2RcclxuICAgICAgICBzdXBlci5vbkxvYWQoKTtcclxuXHJcbiAgICAgICAgLy8gaW5pdCBwcmV2aWV3IHBhbmVsXHJcbiAgICAgICAgbW9kYWxQYW5lbFByZXZpZXcuaW5pdGlhbGl6ZShcInBhbmVsUHJldmlld1wiKTtcclxuXHJcbiAgICAgICAgLy8gdHJhbnNmb3JtIGFsbCBzZWxlY3QgcGlja2VyIGludG8gc2VsZWN0cGlja2VyXHJcbiAgICAgICAgJCgnc2VsZWN0Jykuc2VsZWN0cGlja2VyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuJHNtYXJ0V2l6YXJkLm9uKFwibGVhdmVTdGVwXCIsIChlLCBhbmNob3JPYmplY3QsIGN1cnJlbnRTdGVwSW5kZXgsIG5leHRTdGVwSW5kZXgsIHN0ZXBEaXJlY3Rpb24pID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChjdXJyZW50U3RlcEluZGV4ID09IDEgJiYgbmV4dFN0ZXBJbmRleCA9PSAyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHR5cGUgPSAkKGBpbnB1dFtuYW1lPVwiRW50aXR5Vmlldy5FbnRpdHlUeXBlXCJdOmNoZWNrZWRgKS52YWwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIXR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgIT09ICdBenVyZVNxbFRhYmxlJyAmJiB0eXBlICE9PSAnRGVsaW1pdGVkVGV4dCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXcgbW9kYWxQYW5lbEVycm9yKCdlbnRpdHlTdGVwTm90RXhpc3QnLCAndGhpcyBlbnRpdHkgaXMgbm90IHlldCBpbXBsZW1lbnRlZC4uLicpLnNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy4kc21hcnRXaXphcmQuc21hcnRXaXphcmQoXCJnb1RvU3RlcFwiLCAxKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5vbihcInN0ZXBDb250ZW50XCIsIGFzeW5jIChlLCBhbmNob3JPYmplY3QsIHN0ZXBOdW1iZXIsIHN0ZXBEaXJlY3Rpb24pID0+IHtcclxuXHJcbiAgICAgICAgICAgIGlmIChzdGVwTnVtYmVyID09IDIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy4kZW5naW5lSWRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBlbmdpbmVJZCA9IHRoaXMuJGVuZ2luZUlkRWxlbWVudC52YWwoKS50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFlbmdpbmVJZD8ubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9ICQoYGlucHV0W25hbWU9XCJFbnRpdHlWaWV3LkVudGl0eVR5cGVcIl06Y2hlY2tlZGApLnZhbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXN0VHlwZVNlbGVjdGVkID09PSB0eXBlLnRvU3RyaW5nKCkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxhc3RUeXBlU2VsZWN0ZWQgPSB0eXBlLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSA9PSAnQXp1cmVTcWxUYWJsZScpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLmVudGl0aWVzQXp1cmVTcWwubG9hZEFzeW5jKHRoaXMuaHRtbEZpZWxkUHJlZml4LCB0aGlzLiRwcm9wZXJ0aWVzLCBlbmdpbmVJZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09ICdEZWxpbWl0ZWRUZXh0JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMuZW50aXRpZXNEZWxpbWl0ZWRUZXh0LmxvYWRBc3luYyh0aGlzLmh0bWxGaWVsZFByZWZpeCwgdGhpcy4kcHJvcGVydGllcywgZW5naW5lSWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRzbWFydFdpemFyZC5zbWFydFdpemFyZChcImdvVG9TdGVwXCIsIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbiAgICBhc3luYyBvblVuTG9hZCgpIHtcclxuXHJcbiAgICB9XHJcbn0iLCLvu78vLyBAdHMtY2hlY2tcclxuXHJcbmxldCBqcXVlcnlFeHRlbmRzID0gZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIC8vIGV4dGVuZCBwaWNrZXJcclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBkaXNhYmxlUGlja2VyOiBmdW5jdGlvbiAobXNnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1wdHkoKTtcclxuICAgICAgICAgICAgdGhpcy5hdHRyKFwiZGlzYWJsZWRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEoXCJub25lU2VsZWN0ZWRUZXh0XCIsIG1zZyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0cGlja2VyKCdyZWZyZXNoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGVuYWJsZVBpY2tlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUF0dHIoXCJkaXNhYmxlZFwiKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RwaWNrZXIoJ3JlZnJlc2gnKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gZXh0ZW5kIGVuYWJsZSBkaXNhYmxlIG9mIGJ1dHRvbnMgYW5kIGEgaHJlZlxyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGVuYWJsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGlzYWJsZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgICAgICB0aGlzLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICAvLyBleHRlbmQgbG9hZCBhc3luY1xyXG4gICAgJC5mbi5leHRlbmQoe1xyXG4gICAgICAgIGxvYWRBc3luYzogZnVuY3Rpb24gKGRhdGFfdXJsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWQoZGF0YV91cmwsIChyZXNwb25zZSwgc3RhdHVzLCB4aHIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09IFwiZXJyb3JcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICAkLmZuLmV4dGVuZCh7XHJcbiAgICAgICAgdGVzdEFzeW5jOiBhc3luYyBmdW5jdGlvbiAodXJsKSB7XHJcblxyXG4gICAgICAgICAgICAvLyB0aGlzIGlzIHRoZSBidXR0b24gd2hpY2ggY2xpY2tlZCAhXHJcbiAgICAgICAgICAgIGxldCAkYnRuID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2QtZmxleCBhbGlnbi1pdGVtcy1iYXNlbGluZSB0ZXh0LW5vd3JhcCcpLmFkZENsYXNzKCdkLWZsZXggYWxpZ24taXRlbXMtYmFzZWxpbmUgdGV4dC1ub3dyYXAnKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBidG5JZCA9ICRidG4uYXR0cignaWQnKTtcclxuICAgICAgICAgICAgbGV0IHNwaW5uZXJJZCA9IGAke2J0bklkfVNwaW5uZXJgO1xyXG4gICAgICAgICAgICBsZXQgbWVzc2FnZUlkID0gYCR7YnRuSWR9TWVzc2FnZWA7XHJcblxyXG4gICAgICAgICAgICBsZXQgJHNwaW5uZXJTcGFuID0gJChgIyR7c3Bpbm5lcklkfWApO1xyXG4gICAgICAgICAgICBsZXQgJG1lc3NhZ2VTcGFuID0gJChgIyR7bWVzc2FnZUlkfWApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkc3Bpbm5lclNwYW4ubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgJGJ0bi5hZnRlcihgPHNwYW4gaWQ9JHtzcGlubmVySWR9IHN0eWxlPVwiZGlzcGxheTpub25lO1wiIGNsYXNzPVwibWwtMlwiPjxpIGNsYXNzPVwiZmFzIGZhLXNwaW5uZXIgZmEtc3BpblwiPjwvaT48L3NwYW4+YCk7XHJcblxyXG4gICAgICAgICAgICAkc3Bpbm5lclNwYW4gPSAkKGAjJHtzcGlubmVySWR9YCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoISRtZXNzYWdlU3Bhbi5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAkc3Bpbm5lclNwYW4uYWZ0ZXIoYDxzcGFuIGlkPSR7bWVzc2FnZUlkfSBzdHlsZT1cImRpc3BsYXk6bm9uZTtcIiBjbGFzcz1cIm1sLTJcIj48L3NwYW4+YCk7XHJcblxyXG4gICAgICAgICAgICAkbWVzc2FnZVNwYW4gPSAkKGAjJHttZXNzYWdlSWR9YCk7XHJcblxyXG4gICAgICAgICAgICAkbWVzc2FnZVNwYW4uaGlkZSgpO1xyXG4gICAgICAgICAgICAkc3Bpbm5lclNwYW4uc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgciA9IGF3YWl0ICRidG4ucG9zdEFzeW5jKHVybCwgZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICRzcGlubmVyU3Bhbi5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHIuZXJyb3JzIHx8IHIgPT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBlcnJvcnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHIgJiYgci5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gT2JqZWN0LnZhbHVlcyhyLmVycm9ycykuZmxhdE1hcChlID0+IGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IFtcIkNhbid0IGNvbm5lY3RcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgaHRtbCA9IGA8aSBjbGFzcz1cImZhcyBmYS1leGNsYW1hdGlvblwiPjwvaT4gJHtlcnJvcnNbMF19YDtcclxuICAgICAgICAgICAgICAgICAgICAkbWVzc2FnZVNwYW4uaHRtbChodG1sKTtcclxuICAgICAgICAgICAgICAgICAgICAkbWVzc2FnZVNwYW4uYWRkQ2xhc3MoXCJ0ZXh0LWRhbmdlclwiKS5yZW1vdmVDbGFzcyhcInRleHQtc3VjY2Vzc1wiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGh0bWwgPSAnPGkgY2xhc3M9XCJmYXMgZmEtY2hlY2tcIj48L2k+IGNvbm5lY3Rpb24gc3VjY2Vzc2Z1bCc7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmh0bWwoaHRtbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1lc3NhZ2VTcGFuLmFkZENsYXNzKFwidGV4dC1zdWNjZXNzXCIpLnJlbW92ZUNsYXNzKFwidGV4dC1kYW5nZXJcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkbWVzc2FnZVNwYW4uc2hvdygpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXcgbW9kYWxQYW5lbEVycm9yKFwiZXJyb3JFeHRlbnNpb25Qb3N0XCIsIGUpLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG5cclxuICAgICQuZm4uZXh0ZW5kKHtcclxuICAgICAgICBwb3N0QXN5bmM6IGFzeW5jIGZ1bmN0aW9uICh1cmwsIGNoZWNrSXNWYWxpZCkge1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkKFwiZm9ybVwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChjaGVja0lzVmFsaWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIExhdW5jaCBhIHZhbGlkYXRpb24gYmVmb3JlXHJcbiAgICAgICAgICAgICAgICBsZXQgaXNWYWxpZCA9ICQoXCJmb3JtXCIpLnZhbGlkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpc1ZhbGlkKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IGZvcm1WYWx1ZXMgPSAkKCdmb3JtJykuc2VyaWFsaXplQXJyYXkoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmb3JtZGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgICAgICAkLmVhY2goZm9ybVZhbHVlcywgZnVuY3Rpb24gKGksIHYpIHtcclxuICAgICAgICAgICAgICAgIGZvcm1kYXRhLmFwcGVuZCh2Lm5hbWUsIHYudmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9keTogZm9ybWRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZUpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSA0MDAgfHwgcmVzcG9uc2VKc29uID09PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hlY2tJc1ZhbGlkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGFpbmVyID0gJChkb2N1bWVudCkuZmluZChcIltkYXRhLXZhbG1zZy1zdW1tYXJ5PXRydWVdXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdCA9IGNvbnRhaW5lci5maW5kKFwidWxcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VKc29uICYmIHJlc3BvbnNlSnNvbi5lcnJvcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IE9iamVjdC52YWx1ZXMocmVzcG9uc2VKc29uLmVycm9ycykuZmxhdE1hcChlID0+IGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gW1wiQ2FuJ3QgY29ubmVjdFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3QgJiYgbGlzdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3QuZW1wdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5hZGRDbGFzcyhcInZhbGlkYXRpb24tc3VtbWFyeS1lcnJvcnNcIikucmVtb3ZlQ2xhc3MoXCJ2YWxpZGF0aW9uLXN1bW1hcnktdmFsaWRcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGVycm9ycywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCI8bGkgLz5cIikuaHRtbCh0aGlzKS5hcHBlbmRUbyhsaXN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZUpzb247XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlckV4Y2VwdGlvbjogW2VdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICB9KVxyXG59XHJcblxyXG5cclxuXHJcbi8vYXN5bmMgcG9zdEFzeW5jKCkge1xyXG4vLyAgICAvLyBGaXJzdCwgc2F2ZSB0aGUgZGVwbG95bWVudC5cclxuXHJcbi8vICAgIGxldCB0b2tlbiA9ICQoJ2lucHV0W25hbWU9XCJfX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlblwiXScpLnZhbCgpO1xyXG5cclxuLy8gICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goJycsIHtcclxuLy8gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4vLyAgICAgICAgYm9keTogYGRhdGFTb3VyY2VWaWV3LkVuZ2luZUlkPSR7dGhpcy5kYXRhU291cmNlVmlldy5lbmdpbmVJZH1gICtcclxuLy8gICAgICAgICAgICBgJmRhdGFTb3VyY2VWaWV3LkRhdGFTb3VyY2VUeXBlPSR7dGhpcy5kYXRhU291cmNlVmlldy5kYXRhU291cmNlVHlwZX1gICtcclxuLy8gICAgICAgICAgICBgJmRhdGFTb3VyY2VWaWV3LkNvbm5lY3Rpb25TdHJpbmc9JHt0aGlzLmRhdGFTb3VyY2VWaWV3LmNvbm5lY3Rpb25TdHJpbmd9YCArXHJcbi8vICAgICAgICAgICAgYCZfX1JlcXVlc3RWZXJpZmljYXRpb25Ub2tlbj0ke3Rva2VufWAsXHJcbi8vICAgICAgICBoZWFkZXJzOiB7XHJcbi8vICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9dXRmLThcIlxyXG4vLyAgICAgICAgfVxyXG4vLyAgICB9KTtcclxuXHJcbi8vfVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgKGpxdWVyeUV4dGVuZHMpKCk7Iiwi77u/Ly8gQHRzLWNoZWNrXHJcbmltcG9ydCByb3V0ZXIgZnJvbSBcIi4vcm91dGVyLmpzXCI7XHJcbmltcG9ydCB7IGRhc2hib2FyZFBhZ2UgfSBmcm9tIFwiLi9kYXNoYm9hcmQvaW5kZXguanNcIjtcclxuaW1wb3J0IHsgZW5naW5lc1BhZ2UsIGVuZ2luZURldGFpbHNQYWdlIH0gZnJvbSBcIi4vZW5naW5lcy9pbmRleC5qc1wiO1xyXG5pbXBvcnQgeyBhZG1pblBhZ2UsIGFkbWluRGVwbG95bWVudEVuZ2luZVBhZ2UsIGFkbWluRW5naW5lUmVxdWVzdERldGFpbHNQYWdlIH0gZnJvbSBcIi4vYWRtaW4vaW5kZXguanNcIjtcclxuaW1wb3J0IHsgbWd0bG9hZGVyIH0gZnJvbSBcIi4vbWd0LmpzXCI7XHJcbmltcG9ydCB7IG5vdGlmaWNhdGlvbiB9IGZyb20gXCIuL25vdGlmaWNhdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBob21lUGFnZSB9IGZyb20gXCIuL2hvbWUvaG9tZVBhZ2UuanNcIjtcclxuaW1wb3J0IHsgc2V0dGluZ3NQYWdlIH0gZnJvbSBcIi4vc2V0dGluZ3Mvc2V0dGluZ3NQYWdlLmpzXCI7XHJcbmltcG9ydCB7IGF1dGggfSBmcm9tIFwiLi9hdXRoLmpzXCJcclxuaW1wb3J0IHsgZG90bWltdGFibGUgfSBmcm9tIFwiLi9kb3RtaW10YWJsZVwiXHJcbmltcG9ydCB7IHBlcnNvbkZvcm1hdHRlcnMgfSBmcm9tICcuL2Zvcm1hdHRlcnMvaW5kZXguanMnXHJcbmltcG9ydCB7IGRhdGFTb3VyY2VOZXcsIGRhdGFTb3VyY2VzUGFnZSwgZGF0YVNvdXJjZUVkaXQgfSBmcm9tICcuL2RhdGFTb3VyY2VzL2luZGV4LmpzJ1xyXG5pbXBvcnQgeyBlbnRpdGllc1BhZ2UsIGVudGl0aWVzTmV3UGFnZSB9IGZyb20gJy4vZW50aXRpZXMvaW5kZXguanMnXHJcbmltcG9ydCBkIGZyb20gJy4vZXh0ZW5zaW9ucy5qcyc7XHJcblxyXG5kb3RtaW10YWJsZS5pbml0aWFsaXplKCk7XHJcblxyXG4vLyBJbml0aWFsaXplIGhvbWUgcGFnZSB0byByZWdpc3RlciBub3RpZmljYXRpb25zXHJcbmhvbWVQYWdlLmN1cnJlbnQuaW5pdGlhbGl6ZSgpO1xyXG5cclxuLy8gSW5pdGlhbGl6ZSBhdXRoIGhlbHBlclxyXG5hdXRoLmN1cnJlbnQuaW5pdGlhbGl6ZSgpO1xyXG5cclxuXHJcbm1ndGxvYWRlci5zZXRNZ3RQcm92aWRlcigpO1xyXG5tZ3Rsb2FkZXIuaW50ZXJjZXB0TWd0TG9naW4oKTtcclxuXHJcbnJvdXRlci5yZWdpc3RlcignL0Rhc2hib2FyZCcsIGRhc2hib2FyZFBhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXNoYm9hcmQvSW5kZXgnLCBkYXNoYm9hcmRQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW5naW5lcycsIGVuZ2luZXNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW5naW5lcy9JbmRleCcsIGVuZ2luZXNQYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvRW5naW5lcy9EZXRhaWxzJywgZW5naW5lRGV0YWlsc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9BZG1pbi9JbmRleCcsIGFkbWluUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0FkbWluJywgYWRtaW5QYWdlKTtcclxucm91dGVyLnJlZ2lzdGVyKCcvU2V0dGluZ3MvSW5kZXgnLCBzZXR0aW5nc1BhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9TZXR0aW5ncycsIHNldHRpbmdzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0FkbWluL0RldGFpbHMnLCBhZG1pbkVuZ2luZVJlcXVlc3REZXRhaWxzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0FkbWluL0RlcGxveScsIGFkbWluRGVwbG95bWVudEVuZ2luZVBhZ2UpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXRhU291cmNlcycsIGRhdGFTb3VyY2VzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0RhdGFTb3VyY2VzL05ldycsIGRhdGFTb3VyY2VOZXcpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9EYXRhU291cmNlcy9FZGl0JywgZGF0YVNvdXJjZUVkaXQpO1xyXG5yb3V0ZXIucmVnaXN0ZXIoJy9FbnRpdGllcycsIGVudGl0aWVzUGFnZSk7XHJcbnJvdXRlci5yZWdpc3RlcignL0VudGl0aWVzL05ldycsIGVudGl0aWVzTmV3UGFnZSk7XHJcbiJdLCJuYW1lcyI6WyJtb2RhbFBhbmVsRXJyb3IiLCJyb3V0ZXIiXSwibWFwcGluZ3MiOiJBQUFDO0FBQ0Q7QUFDTyxNQUFNLE1BQU0sQ0FBQztBQUNwQjtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzdCLFFBQVEsSUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDaEQ7QUFDQSxRQUFRLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbEY7QUFDQSxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBLFFBQVEsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7QUFDN0I7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksY0FBYyxHQUFHO0FBQ3JCLFFBQVEsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQ2hDLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksa0JBQWtCLEdBQUc7QUFDekIsUUFBUSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztBQUMzQyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxHQUFHO0FBQ3BCLFFBQVEsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQy9CLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElB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