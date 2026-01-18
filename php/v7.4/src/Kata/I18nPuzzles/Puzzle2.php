<?php // Mobbing practice with the Onyx Team

namespace App\Kata\I18nPuzzles;

abstract class Puzzle2 {
  static function detectWaves(array $input): string {
    $dates = [];
    foreach ($input as $date) {
      $dti = new \DateTimeImmutable($date);
      $dti = $dti->setTimezone(new \DateTimeZone('UTC'));

      $timestamp = $dti->format('c');

      if (!key_exists($timestamp, $dates)) {
        $dates[$timestamp] = 1;
      } else {
        $dates[$timestamp]++;
      }

      if ($dates[$timestamp] === 4) {
        return $timestamp;
      }
    }

    return 'Not Found';
  }
}
