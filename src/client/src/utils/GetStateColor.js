export default function getStateColor(state) {
  switch (state) {
    case 'ACT':
      return 'blue';

    case 'NSW':
      return 'green';

    case 'NT':
      return 'yellow';

    case 'QLD':
      return 'red';

    case 'SA':
      return 'purple';

    case 'TAS':
      return 'pink';

    case 'VIC':
      return 'teal';

    case 'WA':
      return 'orange';

    default:
      return 'gray';
  }
}
