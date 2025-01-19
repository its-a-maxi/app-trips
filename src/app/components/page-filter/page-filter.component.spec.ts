import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFilterComponent } from './page-filter.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PageFilters } from '../../models/page.model';

describe('PageFilterComponent', () => {
  let component: PageFilterComponent;
  let fixture: ComponentFixture<PageFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageFilterComponent, NoopAnimationsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('if #pageFilters state is the basic one, don\'t toogle expansion panel', async () => {
    expect(component.filtersAreOpen).toBeFalse();
  });

  it('if #pageFilters state is not the basic one (except titleFilter), toogle expansion panel and update filters form', async () => {
    component.pageFilters = new PageFilters({minRating: 3});
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.filtersAreOpen).toBeTrue();
    expect(new PageFilters(component.fitlersForm.value)).toEqual(new PageFilters({minRating: 3}));
  });

  it('if #pageFilters state is the basic one (except titleFilter), don\'t toogle expansion panel and update filters form', async () => {
    component.pageFilters = new PageFilters({titleFilter: 'searchTerm'});
    component.ngOnChanges();
    fixture.detectChanges();
    expect(component.filtersAreOpen).toBeFalse();
    expect(new PageFilters(component.fitlersForm.value)).toEqual(new PageFilters({titleFilter: 'searchTerm'}));
  });

  it('if filter toogle is clicked and expansion panel is closed, open it', async () => {
    const toogleButton = fixture.debugElement.nativeElement.querySelector('#filter-toggle');
    toogleButton.click();
    expect(component.filtersAreOpen).toBeTrue();
  });

  it('if filter toogle is clicked and expansion panel is closed, open it', async () => {
    const toogleButton = fixture.debugElement.nativeElement.querySelector('#filter-toggle');
    toogleButton.click();
    expect(component.filtersAreOpen).toBeTrue();
  });

  it('if filter toogle is clicked and expansion panel is open, close it and clean the filter', async () => {
    component.pageFilters = new PageFilters({minRating: 3});
    component.ngOnChanges();
    fixture.detectChanges();
    const toogleButton = fixture.debugElement.nativeElement.querySelector('#filter-toggle');
    toogleButton.click();
    expect(component.filtersAreOpen).toBeFalse();
    expect(new PageFilters(component.fitlersForm.value)).toEqual(new PageFilters);
  });

  it('#apply filters should output #filterChanges event', async () => {
    const outputSpy = spyOn<any>(component.filterChanges, 'emit');
    component.applyFilters();
    expect(outputSpy).toHaveBeenCalledTimes(1);
  });
  
  // updating filter fires event
  // filter state is set on input change
});
