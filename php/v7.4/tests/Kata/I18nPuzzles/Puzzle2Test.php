<?php

namespace  App\Kata\I18nPuzzles;

use PHPUnit\Framework\TestCase;

class Puzzle2Test extends TestCase {
  public function testRun() {
    $input = [
      '2019-06-05T08:15:00-04:00',
      '2019-06-05T14:15:00+02:00',
      '2019-06-05T17:45:00+05:30',
      '2019-06-05T05:15:00-07:00',
      '2011-02-01T09:15:00-03:00',
      '2011-02-01T09:15:00-05:00',
    ];

    $output = Puzzle2::detectWaves($input);

    $this->assertEquals('2019-06-05T12:15:00+00:00', $output);
  }
}
