const hookRegionSorter = () => {
    const regionSelect = document.getElementById('region-filter');

    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            const selectedRegion = regionSelect.value;
            const url = new URL(window.location.href);

            if (selectedRegion && selectedRegion !== 'all') {
                url.searchParams.set('region', selectedRegion);
            } else {
                url.searchParams.delete('region');
            }

            window.location.href = url.toString();
        });
    }
};

const hookSeasonSorter = () => {
    const seasonSelect = document.getElementById('season-filter');

    if (seasonSelect) {
        seasonSelect.addEventListener('change', () => {
            const selectedSeason = seasonSelect.value;
            const url = new URL(window.location.href);

            if (selectedSeason && selectedSeason !== 'all') {
                url.searchParams.set('season', selectedSeason);
            } else {
                url.searchParams.delete('season');
            }

            window.location.href = url.toString();
        });
    }
};

const hookTrainsCatalog = async () => {
    const listEl = document.getElementById('trains-list');
    const templateEl = document.getElementById('train-card-template');
    const loadingEl = document.getElementById('trains-loading');
    const errorEl = document.getElementById('trains-error');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trains');

        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        const trains = payload.trains || [];
        const fragment = document.createDocumentFragment();

        trains.forEach((train) => {
            const card = templateEl.content.cloneNode(true);
            const imageEl = card.querySelector('[data-field="image"]');

            imageEl.src = train.imageUrl;
            imageEl.alt = train.imageAlt || `${train.name} train`;

            card.querySelector('[data-field="name"]').textContent = train.name;
            card.querySelector('[data-field="operator"]').textContent = train.operator;
            card.querySelector('[data-field="type"]').textContent = train.type;
            card.querySelector('[data-field="speed"]').textContent = `${train.maxSpeedKmh} km/h`;
            card.querySelector('[data-field="seats"]').textContent = `${train.capacity} seats`;
            card.querySelector('[data-field="power"]').textContent = train.powerSource;
            card.querySelector('[data-field="description"]').textContent = train.description;
            card.querySelector('[data-field="best-for"]').textContent = train.bestFor;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);

        if (loadingEl) {
            loadingEl.hidden = true;
        }
    } catch (error) {
        console.error('Error loading trains:', error);

        if (loadingEl) {
            loadingEl.hidden = true;
        }

        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trains right now. Please try again in a moment.';
        }
    }
};

// Load schedules dynamically when a month is selected.
const hookScheduleMonths = () => {
    const monthsContainer = document.getElementById('operating-months');
    const schedulesGrid = document.getElementById('schedules-grid');

    if (!monthsContainer || !schedulesGrid) {
        return;
    }

    const tripId = monthsContainer.dataset.tripId;
    const monthButtons = monthsContainer.querySelectorAll('[data-month]');

    const loadSchedules = async (month) => {
        schedulesGrid.innerHTML = '<p>Loading schedules...</p>';

        try {
            const response = await fetch(
                `/api/trips/${encodeURIComponent(tripId)}/schedules?month=${encodeURIComponent(month)}`
            );

            if (!response.ok) {
                throw new Error(`Failed to load schedules (${response.status})`);
            }

            const schedules = await response.json();

            if (!schedules.length) {
                schedulesGrid.innerHTML = '<p>No schedules available for this month.</p>';
                return;
            }

            schedulesGrid.replaceChildren();

            schedules.forEach((schedule) => {
                const card = document.createElement('div');
                card.className = 'schedule-card';

                const times = document.createElement('div');
                times.className = 'schedule-times';

                const departure = document.createElement('div');
                departure.className = 'time-block';

                const departureLabel = document.createElement('span');
                departureLabel.className = 'time-label';
                departureLabel.textContent = 'Departs';

                const departureTime = document.createElement('span');
                departureTime.className = 'time-value';
                departureTime.textContent = schedule.departureTime;

                departure.append(departureLabel, departureTime);

                const arrow = document.createElement('span');
                arrow.className = 'time-arrow';
                arrow.textContent = '→';

                const arrival = document.createElement('div');
                arrival.className = 'time-block';

                const arrivalLabel = document.createElement('span');
                arrivalLabel.className = 'time-label';
                arrivalLabel.textContent = 'Arrives';

                const arrivalTime = document.createElement('span');
                arrivalTime.className = 'time-value';
                arrivalTime.textContent = schedule.arrivalTime;

                arrival.append(arrivalLabel, arrivalTime);

                times.append(departure, arrow, arrival);

                const days = document.createElement('div');
                days.className = 'schedule-days';

                schedule.daysOfWeek.forEach((day) => {
                    const badge = document.createElement('span');
                    badge.className = 'day-badge';
                    badge.textContent = day.substring(0, 3);
                    days.appendChild(badge);
                });

                const bookLink = document.createElement('a');
                bookLink.className = 'book-btn';
                bookLink.href = `/trips/booking/${encodeURIComponent(schedule.id)}`;
                bookLink.textContent = 'Book Now';

                card.append(times, days, bookLink);
                schedulesGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading schedules:', error);
            schedulesGrid.innerHTML =
                '<p>Unable to load schedules. Please try again.</p>';
        }
    };

    monthButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const month = button.dataset.month;

            monthButtons.forEach((item) => {
                item.classList.remove('active');
            });

            button.classList.add('active');
            loadSchedules(month);
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    hookRegionSorter();
    hookSeasonSorter();
    hookTrainsCatalog();
    hookScheduleMonths();
    hookBookingsCatalog();
});

// Load bookings dynamically for the administration page.
const hookBookingsCatalog = async () => {
    const listEl = document.getElementById('bookings-list');
    const templateEl = document.getElementById('booking-card-template');
    const loadingEl = document.getElementById('bookings-loading');
    const errorEl = document.getElementById('bookings-error');
    const emptyEl = document.getElementById('bookings-empty');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/bookings');

        if (!response.ok) {
            throw new Error(`Failed to load bookings (${response.status})`);
        }

        const bookings = await response.json();
        const fragment = document.createDocumentFragment();

        if (!bookings.length) {
            if (emptyEl) {
                emptyEl.hidden = false;
            }
        } else {
            bookings.forEach((booking) => {
                const card = templateEl.content.cloneNode(true);

                card.querySelector('[data-field="id"]').textContent = booking.id;
                card.querySelector('[data-field="ticketClass"]').textContent =
                    booking.ticketClass;
                card.querySelector('[data-field="tripId"]').textContent =
                    booking.tripId;
                card.querySelector('[data-field="scheduleId"]').textContent =
                    booking.scheduleId;
                card.querySelector('[data-field="selectedDay"]').textContent =
                    booking.selectedDay;
                card.querySelector('[data-field="passengerCount"]').textContent =
                    booking.passengers.length;
                card.querySelector('[data-field="createdAt"]').textContent =
                    new Date(booking.createdAt).toLocaleString();

                const passengersList = card.querySelector(
                    '[data-field="passengers"]'
                );

                booking.passengers.forEach((passenger) => {
                    const item = document.createElement('li');
                    item.textContent =
                        `${passenger.firstName} ${passenger.lastName} - ` +
                        `${passenger.email} - ${passenger.phone}`;
                    passengersList.appendChild(item);
                });

                fragment.appendChild(card);
            });

            listEl.replaceChildren(fragment);
        }

        if (loadingEl) {
            loadingEl.hidden = true;
        }
    } catch (error) {
        console.error('Error loading bookings:', error);

        if (loadingEl) {
            loadingEl.hidden = true;
        }

        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent =
                'Unable to load bookings right now. Please try again later.';
        }
    }
};

