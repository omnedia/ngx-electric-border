import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, Input, OnDestroy, PLATFORM_ID, signal, ViewChild, } from '@angular/core';

@Component({
  selector: 'om-electric-border',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ngx-electric-border.component.html',
  styleUrl: './ngx-electric-border.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxElectricBorderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('rootRef') rootRef?: ElementRef<HTMLDivElement>;
  @ViewChild('svgRef') svgRef?: ElementRef<SVGSVGElement>;
  @ViewChild('strokeRef') strokeRef?: ElementRef<HTMLDivElement>;

  private static nextId = 0;

  readonly filterId = `turbulent-displace-${NgxElectricBorderComponent.nextId++}`;

  private _color = '#9e27ff';
  private _speed = 1;
  private _chaos = 1;
  private _thickness = 2;

  @Input()
  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value || '#9e27ff';
    this.updateAnim();
  }

  @Input()
  get speed(): number {
    return this._speed;
  }

  set speed(value: number) {
    const normalized = Number(value || 1);
    this._speed = normalized > 0 ? normalized : 1;
    this.updateAnim();
  }

  @Input()
  get chaos(): number {
    return this._chaos;
  }

  set chaos(value: number) {
    const normalized = Number(value || 1);
    this._chaos = normalized > 0 ? normalized : 1;
    this.updateAnim();
  }

  @Input()
  get thickness(): number {
    return this._thickness;
  }

  set thickness(value: number) {
    const normalized = Number.isFinite(Number(value)) ? Number(value) : 2;
    this._thickness = normalized > 0 ? normalized : 2;
  }

  @Input() className?: string;
  @Input() styling: { [key: string]: any } | null = null;

  private readonly isBrowser: boolean;
  private resizeObserver?: ResizeObserver;

  isInView = signal(false);
  private intersectionObserver?: IntersectionObserver;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get hostStyle(): { [key: string]: any } {
    return {
      ...(this.styling ?? {}),
      '--electric-border-color': this.color,
      '--eb-border-width': `${this.thickness}px`,
    };
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.rootRef) return;

    const host = this.rootRef.nativeElement;

    this.resizeObserver = new ResizeObserver(() => this.updateAnim());
    this.resizeObserver.observe(host);

    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.isInView.set(entry.isIntersecting);

      if (entry.isIntersecting) {
        this.updateAnim();
      } else {
        this.stopAnim();
      }
    }, {threshold: 0.05});

    this.intersectionObserver.observe(host);

    this.updateAnim();
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.intersectionObserver) this.intersectionObserver.disconnect();
  }

  private updateAnim(): void {
    if (!this.isBrowser) return;
    if (!this.isInView()) return;

    const svg = this.svgRef?.nativeElement;
    const host = this.rootRef?.nativeElement;

    if (!svg || !host) return;

    if (this.strokeRef?.nativeElement) {
      this.strokeRef.nativeElement.style.filter = `url(#${this.filterId})`;
    }

    const width = Math.max(
      1,
      Math.round(host.clientWidth || host.getBoundingClientRect().width || 0),
    );
    const height = Math.max(
      1,
      Math.round(host.clientHeight || host.getBoundingClientRect().height || 0),
    );

    const dyAnims = Array.from(
      svg.querySelectorAll<SVGAnimateElement>(
        'feOffset > animate[attributeName="dy"]',
      ),
    );
    if (dyAnims.length >= 2) {
      dyAnims[0].setAttribute('values', `${height}; 0`);
      dyAnims[1].setAttribute('values', `0; -${height}`);
    }

    const dxAnims = Array.from(
      svg.querySelectorAll<SVGAnimateElement>(
        'feOffset > animate[attributeName="dx"]',
      ),
    );
    if (dxAnims.length >= 2) {
      dxAnims[0].setAttribute('values', `${width}; 0`);
      dxAnims[1].setAttribute('values', `0; -${width}`);
    }

    const baseDur = 6;
    const dur = Math.max(0.001, baseDur / (this.speed || 1));
    [...dyAnims, ...dxAnims].forEach((a) => a.setAttribute('dur', `${dur}s`));

    const disp = svg.querySelector<SVGFEDisplacementMapElement>(
      'feDisplacementMap',
    );
    if (disp) {
      disp.setAttribute('scale', String(30 * (this.chaos || 1)));
    }

    const filterEl = svg.querySelector<SVGFilterElement>(`#${this.filterId}`);
    if (filterEl) {
      filterEl.setAttribute('x', '-200%');
      filterEl.setAttribute('y', '-200%');
      filterEl.setAttribute('width', '500%');
      filterEl.setAttribute('height', '500%');
    }

    requestAnimationFrame(() => {
      [...dyAnims, ...dxAnims].forEach((a: any) => {
        if (typeof a.beginElement === 'function') {
          try {
            a.beginElement();
          } catch {
            // no-op
          }
        }
      });
    });
  }

  private stopAnim(): void {
    if (!this.isBrowser) return;

    const svg = this.svgRef?.nativeElement;
    if (!svg) return;

    const anims = svg.querySelectorAll('animate');
    anims.forEach(a => {
      a.setAttribute('dur', '0s');
    });
  }

}
