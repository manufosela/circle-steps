import { LitElement, html, css } from 'lit-element';

/**
 * `circle-steps`
 * CircleSteps
 *
 * @customElement circle-steps
 * @polymer
 * @litElement
 * @demo demo/index.html
 */

class CircleSteps extends LitElement {
  static get is() { 
    return 'circle-steps'; 
  }

  static get properties() {
    return {
      id: { type: String },
      title: { type: String },
      phases: { type: Array },
      width: { type: Number },
      changeMode: { type: String, attribute: 'change-mode' },
      activeMode: { type: String, attribute: 'active-mode' },
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
      .process-model {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        justify-content: space-evenly;
        list-style: none;
        padding: 0;
        position: relative;
        margin: 0 auto;
        border: none;
        z-index: 0;
      }
      .process-model li::after {
        background: #e5e5e5 none repeat scroll 0 0;
        bottom: 0;
        content: "";
        display: block;
        height: 4px;
        margin: 0 auto;
        position: absolute;
        right: 0;
        top: 33px;
        width: 100%;
        z-index: -1;
      }
      .process-model li.visited::after {
        background: #57b87b;
      }
      .process-model li:last-child::after {
        width: 0;
      }
      .process-model li {
        text-align: center;
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 0;
      }
      .nav-tabs.process-model > li.active > a, .nav-tabs.process-model > li.active > a:hover, .nav-tabs.process-model > li.active > a:focus, .process-model li a:hover, .process-model li a:focus {
        border: none;
        background: transparent;
      }
      .process-model li a {
        padding: 0;
        border: none;
        color: #606060;
        text-decoration: none;
      }
      .process-model li.active,
      .process-model li.visited {
        color: #57b87b;
      }
      .process-model li.active a,
      .process-model li.active a:hover,
      .process-model li.active a:focus,
      .process-model li.visited a,
      .process-model li.visited a:hover,
      .process-model li.visited a:focus {
        color: #57b87b;
      }
      .process-model li.active p,
      .process-model li.visited p {
        font-weight: 600;
      }
      .process-model li i {
        display: block;
        height: 68px;
        width: 68px;
        text-align: center;
        margin: 0 auto;
        background: #f5f6f7;
        border: 2px solid #e5e5e5;
        line-height: 65px;
        font-size: 30px;
        border-radius: 50%;
      }
      .process-model li.active i, .process-model li.visited i  {
        background: #fff;
        border-color: #57b87b;
      }
      .process-model li p {
        font-size: 14px;
        margin-top: 11px;
      }
      .process-model.contact-us-tab li.visited a, .process-model.contact-us-tab li.visited p {
        color: #606060!important;
        font-weight: normal
      }
      .process-model.contact-us-tab li::after  {
        display: none; 
      }
      .process-model.contact-us-tab li.visited i {
        border-color: #e5e5e5; 
      }

      @media screen and (max-width: 560px) {
        .more-icon-preocess.process-model li span {
            font-size: 23px;
            height: 50px;
            line-height: 46px;
            width: 50px;
          }
          .more-icon-preocess.process-model li::after {
            top: 24px;
          }
      }
      @media screen and (max-width: 380px) { 
          .process-model.more-icon-preocess li {
            width: 16%;
          }
          .more-icon-preocess.process-model li span {
            font-size: 16px;
            height: 35px;
            line-height: 32px;
            width: 35px;
          }
          .more-icon-preocess.process-model li p {
            font-size: 8px;
          }
          .more-icon-preocess.process-model li::after {
            top: 18px;
          }
          .process-model.more-icon-preocess {
            text-align: center;
          }
      }
    `;
  }
  
  constructor() {
    super();
    this.id = `circleStep-${new Date().getTime()}`;
    this.title = 'Circle Steps';
    this.phases = ['one', 'two', 'three', 'four', 'five', 'six'];
    this.width = 600;
    this.active = 1;
    this.changeMode = 'click'; // 'click' or 'event'
    this.activeMode = 'onexTime'; // 'onexTime' or 'allLast'

    document.addEventListener('set-phase', this._setPhase.bind(this));
  }

  connectedCallback() {
    super.connectedCallback();
    const $lis = [...this.querySelectorAll('li')];
    this.phases = $lis.map(item => {
      return item.getAttribute('name');
    });
    this.phaseTexts = $lis.map(item => {
      return item.innerText;
    });
  } 

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('set-phase', this._setPhase.bind(this));
  }

  firstUpdated() {
    if (this.changeMode === 'click') {
      this.shadowRoot.querySelectorAll('a[data-toggle="tab"]').forEach(el => {
        el.addEventListener('click', this._eventClick.bind(this));
      });
    } else {
      this.shadowRoot.querySelectorAll('a[data-toggle="tab"]').forEach(el => {
        el.style.cursor = 'default';
        el.addEventListener('mouseover', this._eventHover.bind(this));
        el.addEventListener('mouseoot', this._eventOut.bind(this));
        el.addEventListener('click', this._eventSelect.bind(this));
      });
    }
  }

  _setPhase(e) {
    if (e.detail.id === this.id) { 
      const target = this.shadowRoot.querySelector(`.process-model li[data-id="${e.detail.phase}"] a`);
      this._newPhase(target);
    }
  }

  _eventClick(e) {
    const target = e.target.parentElement;
    this._newPhase(target);
  }

  _eventHover(e) {
    const target = e.target.parentElement;
    if (target.dataset.index !== undefined) {
      const eventHoverCircle = new CustomEvent('hover-circle', { detail: { el:'circle-steps', id: this.id, active: this.active, phase: target.dataset.phase, index: target.dataset.index } })
      document.dispatchEvent(eventHoverCircle);
    }
  }

  _eventOut(e) {
    const target = e.target.parentElement;
    if (target.dataset.index !== undefined) {
      const eventOutCircle = new CustomEvent('out-circle', { detail: { el:'circle-steps', id: this.id, active: this.active, phase: target.dataset.phase, index: target.dataset.index } })
      document.dispatchEvent(eventOutCircle);
    }
  }

  _eventSelect(e) {
    const target = e.target.parentElement;
    if (target.dataset.index !== undefined) {
      const eventSelectCircle = new CustomEvent('select-circle', { detail: { el:'circle-steps', id: this.id, active: this.active, phase: target.dataset.phase, index: target.dataset.index } })
      document.dispatchEvent(eventSelectCircle);
    }
  }

  _newPhase(target) {
    const name = target.getAttribute('name');
    const dataId = target.parentElement.dataset.id;
    const $curr = this.shadowRoot.querySelector('.process-model  a[name="' + name + '"]').parentElement;
    if (this.activeMode === 'onexTime') {
      this.shadowRoot.querySelector('.process-model li.active').classList.remove('active');
    } else {
      [...this.shadowRoot.querySelectorAll('.process-model li')].forEach(el => { el.classList.add('active'); });
      [...this.shadowRoot.querySelectorAll(`.process-model li[data-id="${dataId}"] ~ li`)].forEach((el) => { el.classList.remove('active'); });
    }
    $curr.classList.add('active');
    this.active = Number(dataId); 
    document.dispatchEvent(new CustomEvent('change', { detail: { el:'circle-steps', id: this.id, active: this.active, phase: this.phases[this.active] } }));
  }

  render() {
    return html`
      <ul class="nav nav-tabs process-model more-icon-preocess" role="tablist" style="width:${this.width}px">
        ${this.phases.map((phase, index) => html`
          <li role="presentation" data-id="${index+1}" class="${(this.active===index+1) ? 'active' : ''}">
            <a name="#${phase}" aria-controls="discover" role="tab" data-toggle="tab" title="${this.phaseTexts[index]}" data-phase="${phase}" data-index="${index + 1}">
              <i aria-hidden="true">${index + 1}</i>
              <p>${phase}</p>
            </a>
          </li>`)}
      </ul>
    `;
  }
}

window.customElements.define(CircleSteps.is, CircleSteps);